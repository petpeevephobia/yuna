import asyncio
import time
from okx_client import OKXClient
from store import load_state, set_bot_status, append_trade, mark_fired, set_last_bought_qty

POLL_INTERVAL_SECONDS = 10
client = OKXClient()

async def bot_loop():
    while True:
        state = load_state()
        if state["bot_status"] != "active":
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            continue

        settings = state["settings"]
        fired = state["fired"]
        last_bought_qty = state.get("last_bought_qty", 0.0)
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

        # --- BUY BRANCH ---
        if buy_trigger and price <= buy_trigger and not fired["buy"]:
            try:
                btc_qty = round(float(order_size) / buy_trigger, 6)
                client.place_limit_order(inst_id, "buy", buy_trigger, str(btc_qty))
                
                # Save the quantity bought so the sell branch knows how much to sell
                set_last_bought_qty(btc_qty)
                mark_fired("buy")
                
                fulfilled_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                append_trade({
                    "timestamp": time.time(), 
                    "side": "buy",
                    "price": buy_trigger, 
                    "size": f"{order_size} USDT ({btc_qty} BTC)",
                    "status_msg": f"FULFILLED ON {fulfilled_time}"
                })
                
                print(f"[bot_loop] BUY order placed @ {buy_trigger} for {btc_qty} BTC")
            except Exception as e:
                print(f"[bot_loop] buy order failed: {e}")

        # --- SELL BRANCH ---
        if sell_trigger and price >= sell_trigger and not fired["sell"]:
            try:
                balances = client.get_balance()
                available_btc = balances.get("BTC", 0.0)

                # Target quantity is only what Yuna bought (fallback to available_btc if 0)
                target_qty = last_bought_qty if last_bought_qty > 0 else available_btc
                qty_to_sell = min(target_qty, available_btc)

                if qty_to_sell < 0.0001:
                    print(f"[bot_loop] Sell skipped: Insufficient BTC balance ({available_btc}) for target ({target_qty})")
                    await asyncio.sleep(POLL_INTERVAL_SECONDS)
                    continue

                sell_size = str(round(qty_to_sell, 6))
                
                client.place_limit_order(inst_id, "sell", price, sell_size)
                mark_fired("sell")
                set_last_bought_qty(0.0)  # Reset bought quantity after sell
                
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