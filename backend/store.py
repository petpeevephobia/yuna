import json
from pathlib import Path

DATA_FILE = Path("data.json")

DEFAULT_STATE = {
    "settings": {
        "inst_id": "BTC-USDT",
        "buy_trigger": None,
        "sell_trigger": None,
        "order_size": None,
    },
    "bot_status": "paused",   # "active" | "paused" | "error"
    "trade_history": [],
}

def load_state() -> dict:
    if not DATA_FILE.exists():
        save_state(DEFAULT_STATE)
    return json.loads(DATA_FILE.read_text())

def save_state(state: dict) -> None:
    DATA_FILE.write_text(json.dumps(state, indent=2))

def update_settings(new_settings: dict) -> dict:
    state = load_state()
    state["settings"].update(new_settings)
    save_state(state)
    return state["settings"]

def set_bot_status(status: str) -> None:
    state = load_state()
    state["bot_status"] = status
    save_state(state)

def append_trade(trade: dict) -> None:
    state = load_state()
    state["trade_history"].append(trade)
    save_state(state)