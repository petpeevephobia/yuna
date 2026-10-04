# Yuna

## Why Yuna

Yuna is a personal, no-nonsense crypto trading bot built on top of the OKX API. The idea is simple: set a buy price and a sell price for an asset, define how much to trade, and let Yuna watch the market and place limit orders when your triggers are hit - without needing to babysit a chart all day.

This MVP is deliberately narrow. No strategy engine, no backtesting, no multi-exchange abstraction. Just: watch price → hit trigger → place limit order → log it → repeat. Everything else comes later, once the core loop is proven reliable.

## MVP Scope

**In scope:**

- Connect to OKX via API key/secret
- Set a target buy price and target sell price for one trading pair at a time
- Set an order size (in quote currency, e.g. USDT)
- Place a limit order automatically when the market price crosses a trigger
- Start/Pause the bot (kill switch)
- View current price, balances, open orders, and trade history in a simple UI

**Out of scope (for now):**

- Multiple simultaneous pairs/strategies
- Trailing stops, DCA, grid trading, or any advanced order logic
- Multi-exchange support
- Backtesting or historical simulation
- Notifications (email/Telegram/etc.) - now just logs



## Tech Stack

- **Python** - the bot engine. Owns all OKX API interaction, the price-check loop, and trigger logic. This is the core of Yuna.
- **Next.js** - the UI. A single dashboard page that talks to the Python backend over a simple REST API (and optionally a WebSocket/SSE for live price updates).
- **Go** - not used in the MVP. Held in reserve only if a specific piece later needs lower latency or concurrency than Python comfortably gives (e.g. a dedicated price-feed service). No Go code until there's a concrete reason for it.
- **Docker** - not used in the MVP. Local dev runs the Python backend and Next.js frontend directly. Containerization gets added only if/when deployment (e.g. running Yuna on a VPS 24/7) makes it worthwhile.



## Architecture Overview

```
+-------------------+         REST/WS         +----------------------+
|   Next.js UI      | <---------------------> |   Python Bot Engine  |
|  (dashboard)      |                          |  (FastAPI or Flask) |
+-------------------+                          +----------------------+
                                                        |
                                                        | REST
                                                        v
                                                +----------------------+
                                                |     OKX API          |
                                                +----------------------+
```

- The Python backend runs a simple polling loop (every N seconds) that fetches the current market price from OKX, checks it against the stored buy/sell triggers, and fires a limit order via OKX's API when a trigger is hit.
- Settings (API keys, triggers, order size, bot status) are read/written through the same backend and persisted locally - a single SQLite file or even a flat JSON file is enough for the MVP. No need for a full database yet.
- Trade history and logs are appended to the same local store and served to the UI on request.
- The Next.js frontend is a thin client: it renders state, sends config changes (triggers, order size, start/pause), and polls or subscribes for updates. No trading logic lives in the frontend.



## UI Spec



### 1. Control Panel (Inputs)

- API key / secret fields (stored securely, never rendered back in full)
- Target Buy Price / Target Sell Price inputs
- Order Size input (quote currency amount, e.g. USDT)
- Start/Pause ("Kill Switch") toggle - one click halts all automated trading



### 2. Status & Monitoring

- Bot status badge: Active (green) / Paused (yellow) / Disconnected/Error (red)
- Live current market price for the selected pair
- Current balances (base asset + quote asset, e.g. BTC / USDT)



### 3. Activity Tracking

- Pending Orders table - open orders currently sitting on OKX
- Trade History log - scrollable list of filled trades (timestamp, side, price, amount)

```
+-----------------------------------------------------------------------+
|  [ BOT STATUS: ACTIVE ]                      [ PAUSE BOT / KILL SWITCH] |
+-----------------------------------------------------------------------+
|  MARKET: BTC/USDT                            CURRENT PRICE: $64,250   |
|  BALANCES: 0.12 BTC  |  2,500 USDT                                    |
+-----------------------------------------------------------------------+
|  STRATEGY SETTINGS                                                    |
|  [ Buy Trigger Price: $62,000 ]      [ Order Size: 200 USDT       ]   |
|  [ Sell Trigger Price: $66,000 ]     [ [ SAVE & APPLY ]           ]   |
+-----------------------------------------------------------------------+
|  OPEN ORDERS                                                          |
|  - LIMIT BUY @ $62,000 (200 USDT)                                     |
|  - LIMIT SELL @ $66,000 (0.05 BTC)                                    |
+-----------------------------------------------------------------------+
|  RECENT LOGS                                                          |
|  [14:22:01] Filled: Buy 0.003 BTC at $62,100                          |
|  [14:00:00] Bot checked prices: No triggers hit.                      |
+-----------------------------------------------------------------------+
```



## Project Structure (suggested)

```
Yuna/
├── backend/
│   ├── main.py            # FastAPI app entrypoint
│   ├── okx_client.py      # OKX API wrapper (auth, price, balances, orders)
│   ├── bot_loop.py        # Polling loop + trigger logic
│   ├── store.py           # Local persistence (SQLite/JSON) for settings & history
│   └── config.py          # Env vars, constants
├── frontend/
│   ├── app/                # Next.js app directory
│   ├── components/         # Dashboard UI components
│   └── lib/api.ts          # Client for talking to the Python backend
└── README.md
```



## Getting Started (minimal)

1. Add your OKX API key/secret (via the UI or a local `.env` - never commit these).
2. Go to `cd backend` and activate Python virtual environment: `venv\Scripts\activate`
2. Run the Python backend: `uvicorn main:app --host 127.0.0.1 --port 8000 --reload`
3. Go to `cd frontend` and run the Next.js frontend: `npm run dev`
4. Open the dashboard at http://localhost:3000, set your buy/sell triggers and order size, hit Start.



## Roadmap (post-MVP)

- Notifications on fills (Telegram/email)
- Multi-pair support
- Dockerized deployment for always-on running
- More order types (OCO, trailing)

