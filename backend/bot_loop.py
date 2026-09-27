import asyncio
import time
from okx_client import OKXClient
from store import load_state, set_bot_status, append_trade

POLL_INTERVAL_SECONDS = 10
client = OKXClient()

# tracks whether each trigger has already fired, so we don't spam orders
_fired = {"buy": False, "sell": False}

async def bot_loop():
    while True:
        state = load_state()
        if state["bot_status"] != "active":
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            continue

        settings = state["settings"]
        inst_id = settings["inst_id"]
        buy_trigger = settings.get("buy_trigger")
        sell_trigger = settings.get("sell_trigger")
        order_size = settings.get("order_size")

        try:
            price = client.get_ticker(inst_id)
        except Exception as e:
            print(f"[bot_loop] price fetch failed: {e}")
            set_bot_status("error")
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            continue

        if buy_trigger and price <= buy_trigger and not _fired["buy"]:
            try:
                client.place_limit_order(inst_id, "buy", buy_trigger, order_size)
                append_trade({
                    "timestamp": time.time(), "side": "buy",
                    "price": buy_trigger, "size": order_size,
                })
                _fired["buy"] = True
                print(f"[bot_loop] BUY order placed @ {buy_trigger}")
            except Exception as e:
                print(f"[bot_loop] buy order failed: {e}")

        if sell_trigger and price >= sell_trigger and not _fired["sell"]:
            try:
                client.place_limit_order(inst_id, "sell", sell_trigger, order_size)
                append_trade({
                    "timestamp": time.time(), "side": "sell",
                    "price": sell_trigger, "size": order_size,
                })
                _fired["sell"] = True
                print(f"[bot_loop] SELL order placed @ {sell_trigger}")
            except Exception as e:
                print(f"[bot_loop] sell order failed: {e}")

        await asyncio.sleep(POLL_INTERVAL_SECONDS)