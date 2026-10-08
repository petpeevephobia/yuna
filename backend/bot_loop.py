import asyncio
import time
from okx_client import OKXClient
from store import load_state, set_bot_status, append_trade, mark_fired

POLL_INTERVAL_SECONDS = 10
client = OKXClient()

# "fired" flags (so we don't spam orders) live in data.json via store.py, so they survive restarts

async def bot_loop():
    while True:
        state = load_state()
        if state["bot_status"] != "active":
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            continue

        settings = state["settings"]
        fired = state["fired"]
        inst_id = settings["inst_id"]
        buy_trigger = settings.get("buy_trigger")
        sell_trigger = settings.get("sell_trigger")
        order_size = settings.get("order_size")

        try:
            price = client.get_ticker(inst_id)
            print(f"[bot_loop] checked {inst_id} @ {price} (buy_trigger={buy_trigger}, sell_trigger={sell_trigger})")
        except Exception as e:
            print(f"[bot_loop] price fetch failed: {e}")
            set_bot_status("error")
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            continue


        if buy_trigger and price <= buy_trigger and not fired["buy"]:
            try:
                btc_qty = round(float(order_size) / buy_trigger, 6)
                client.place_limit_order(inst_id, "buy", buy_trigger, str(btc_qty))
                mark_fired("buy")  # persist right after the order goes out
                
                # Create a formatted human-readable date & time string
                fulfilled_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                
                # Append to trade history array (this feeds your UI log terminal)
                append_trade({
                    "timestamp": time.time(), 
                    "side": "buy",
                    "price": buy_trigger, 
                    "size": f"{order_size} USDT ({btc_qty} BTC)",
                    "status_msg": f"FULFILLED ON {fulfilled_time}" # <-- Explicit fulfillment clock
                })
                
                print(f"[bot_loop] BUY order placed @ {buy_trigger}")
            except Exception as e:
                print(f"[bot_loop] buy order failed: {e}")


        if sell_trigger and price >= sell_trigger and not fired["sell"]:
            try:
                # 1. Fetch your exact, live available BTC balance directly from the exchange
                balances = client.get_balance()
                available_btc = balances.get("BTC", 0.0)

                if available_btc < 0.0001:
                    print(f"[bot_loop] Sell skipped: Insufficient BTC balance ({available_btc})")
                    await asyncio.sleep(POLL_INTERVAL_SECONDS)  # don't hammer OKX while waiting for BTC
                    continue

                # 2. Sell your [ENTIRE] available BTC cache instead of back-calculating a fractional size
                sell_size = str(round(available_btc, 6))
                
                # Place the limit sell order at the current market price rather than the trigger line
                client.place_limit_order(inst_id, "sell", price, sell_size)
                mark_fired("sell")  # persist right after the order goes out
                
                # Update your tracking logs with the true executed asset values
                fulfilled_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                append_trade({
                    "timestamp": time.time(), 
                    "side": "sell",
                    "price": price, 
                    "size": f"{sell_size} BTC",
                    "status_msg": f"FULFILLED ON {fulfilled_time}"
                })
                
                print(f"[bot_loop] SELL order successfully executed for {sell_size} BTC")
            except Exception as e:
                print(f"[bot_loop] sell order failed at network layer: {e}")


 



        await asyncio.sleep(POLL_INTERVAL_SECONDS)