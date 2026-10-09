import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from okx_client import OKXClient
from store import load_state, update_settings, set_bot_status, reset_fired
from bot_loop import bot_loop

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(bot_loop())
    print("[main] bot_loop task started")  # confirm this line prints on startup
    yield
    task.cancel()

app = FastAPI(lifespan=lifespan)
client = OKXClient()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# remove the old @app.on_event("startup") block entirely:
# @app.on_event("startup")
# async def startup():
#     asyncio.create_task(bot_loop())

class SettingsIn(BaseModel):
    inst_id: str
    buy_trigger: float | None = None
    sell_trigger: float | None = None
    stop_loss: float | None = None
    order_size: str | None = None

@app.get("/api/status")
def get_status():
    state = load_state()
    return {
        "bot_status": state["bot_status"],
        "settings": state["settings"],
    }

@app.post("/api/settings")
def post_settings(payload: SettingsIn):
    updated = update_settings(payload.dict(exclude_none=True))
    reset_fired()
    return updated

@app.post("/api/bot/start")
def start_bot():
    set_bot_status("active")
    return {"bot_status": "active"}

@app.post("/api/bot/pause")
def pause_bot():
    set_bot_status("paused")
    return {"bot_status": "paused"}

@app.get("/api/market/price")
def market_price(inst_id: str = "BTC-USDT"):
    return {"price": client.get_ticker(inst_id)}

@app.get("/api/balances")
def balances():
    return client.get_balance()

@app.get("/api/orders/pending")
def pending_orders(inst_id: str = "BTC-USDT"):
    return client.get_pending_orders(inst_id)

@app.get("/api/orders/filled")
def filled_orders(inst_id: str = "BTC-USDT"):
    # real executions reported by OKX (recent fills), not the bot's local log
    return client.get_fills(inst_id)

@app.get("/api/trades/history")
def trade_history():
    return load_state()["trade_history"]