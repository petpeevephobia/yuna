import json
from pathlib import Path

DATA_FILE = Path("data.json")

DEFAULT_STATE = {
    "settings": {
        "inst_id": "BTC-USDT",
        "buy_trigger": None,
        "sell_trigger": None,
        "stop_loss": None,
        "order_size": None,
    },
    "bot_status": "paused",   # "active" | "paused" | "error"
    "trade_history": [],
    "fired": {"buy": False, "sell": False, "stop_loss": False},   # survives restarts
    "last_bought_qty": 0.0,
}

def load_state() -> dict:
    if not DATA_FILE.exists():
        save_state(DEFAULT_STATE)
    state = json.loads(DATA_FILE.read_text())
    state.setdefault("fired", {"buy": False, "sell": False, "stop_loss": False})
    state["settings"].setdefault("stop_loss", None)
    state.setdefault("last_bought_qty", 0.0)
    return state

def set_last_bought_qty(qty: float) -> None:
    state = load_state()
    state["last_bought_qty"] = qty
    save_state(state)

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

def mark_fired(side: str) -> None:
    """Record that `side` fired and re-arm the opposite side (ping-pong cycle)."""
    state = load_state()
    other = "sell" if side == "buy" else "buy"
    state["fired"][side] = True
    state["fired"][other] = False
    save_state(state)

def reset_fired() -> None:
    state = load_state()
    state["fired"] = {"buy": False, "sell": False, "stop_loss": False}
    save_state(state)