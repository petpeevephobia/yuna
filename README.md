# Yuna

## Why Yuna

Yuna is a personal, no-nonsense crypto trading bot built on top of the OKX API. The idea is simple: set a buy price and a sell price for an asset, define how much to trade, and let Yuna watch the market and place limit orders when your triggers are hit - without needing to babysit a chart all day.

This MVP is deliberately narrow. No strategy engine, no backtesting, no multi-exchange abstraction. Just: watch price → hit trigger → place limit order → log it → repeat. Everything else comes later, once the core loop is proven reliable.

---

## How Yuna Trades: Basic Ping-Pong

Yuna runs one strategy: a **ping-pong** (a.k.a. range) trade. You pick two prices, a **buy trigger** (low) and a **sell trigger** (high). Yuna buys when the market drops to the low price, sells when it climbs to the high price, and then starts over. Each completed buy → sell round trip tries to capture the gap between the two triggers.

```
price
  ▲
  │                    ┌─────────── SELL TRIGGER ───────────  ← sell all BTC (limit @ market)
  │                   ╱ ╲                  ╱╲
  │      ╱╲          ╱   ╲      ╱╲        ╱  ╲
  │     ╱  ╲        ╱     ╲    ╱  ╲      ╱    ╲
  │    ╱    ╲      ╱       ╲  ╱    ╲    ╱      ╲
  ├───╱──────╲────╱─────────╲╱──────╲──╱────────╲──────────  ← buy (limit @ trigger)
  │            BUY TRIGGER
  └──────────────────────────────────────────────────────────▶ time
          ①BUY        ②SELL      ③BUY      ④SELL
```

### The loop

Every **10 seconds** the backend runs one pass of `bot_loop.py`:

1. **Gate:** if the bot isn't `active` (paused or error), do nothing this pass.
2. **Fetch price:** read the latest price (`last`) for the pair from OKX. If this fails, the status flips to `error` and the loop idles until you press Start again.
3. **Buy check:** if a buy trigger is set, `price <= buy_trigger`, and the buy side is not already fired → place a buy.
4. **Sell check:** if a sell trigger is set, `price >= sell_trigger`, and the sell side is not already fired → place a sell.
5. Sleep and repeat.

### What a buy does

- Order type: **limit buy at the buy trigger price**.
- You enter the order size in **USDT**, but OKX spot orders are sized in the base coin, so Yuna converts it: `BTC quantity = order_size ÷ buy_trigger`, rounded to 6 decimals. Example: 50 USDT at 85,350 → `0.000586 BTC`.
- The trade is logged, the buy side is marked as fired, and the **sell side is re-armed**.

### What a sell does

- Yuna asks OKX for your **live available BTC balance**. If it's below `0.0001 BTC`, the sell is skipped (nothing meaningful to sell).
- Otherwise it sells **your entire available BTC balance** (rounded to 6 decimals) as a **limit order at the current market price**, not at the trigger line.
- The trade is logged, the sell side is marked as fired, and the **buy side is re-armed**.

### Why it doesn't spam orders

Two in-memory flags, `fired["buy"]` and `fired["sell"]`, keep each side from triggering repeatedly while the price sits beyond a trigger. They work as a simple two-state machine:

```
                 price ≤ buy trigger
   ┌──────────┐ ───────────────────────▶ ┌───────────────┐
   │  WAITING │                          │ HOLDING BTC   │
   │  TO BUY  │ ◀─────────────────────── │ (waiting to   │
   └──────────┘   price ≥ sell trigger   │  sell)        │
                                         └───────────────┘
        (buy fired → sell re-armed)   (sell fired → buy re-armed)
```

Both flags start cleared, so whichever trigger the market hits first goes first. The flags are cleared again when you **Save & Apply** new settings, and whenever the backend **restarts** (they live in memory only).

### Worked example

| Setting | Value |
|---|---|
| Pair | BTC-USDT |
| Buy trigger | 85,350 |
| Sell trigger | 85,400 |
| Order size | 50 USDT |

1. Price falls to 85,347 → Yuna places a limit **buy** at 85,350 for `0.000586 BTC` (≈ 50 USDT).
2. Price drifts up to 85,402 → Yuna reads the BTC balance and places a limit **sell** of that balance at ~85,402.
3. Gross result ≈ `0.000586 × (85,402 − 85,350)` ≈ **+0.03 USDT**, and the buy side is armed again for the next dip.

### Things worth knowing about this strategy

- **It earns the spread, not a trend.** It works best when the price oscillates inside your band. If the price falls after a buy and never reaches the sell trigger, Yuna keeps holding the BTC. There is no stop-loss.
- **Fees are not subtracted.** With a narrow band like the example above, exchange fees on the two legs can be larger than the gross spread. Keep the gap between triggers wider than your round-trip fees.
- **Placed ≠ confirmed filled.** A limit buy at or above the market (or a sell at the market) normally fills right away, but Yuna logs the trade when the order is *placed* and does not poll OKX to confirm the fill.
- **The sell uses your whole BTC balance.** That includes BTC Yuna didn't buy. On a fresh OKX demo account (which starts with 1 BTC), the first sell will sell all of it.

---

## MVP Scope

**In scope:**

- Connect to OKX via API key/secret/passphrase (from a local `.env`)
- Set a target buy price and target sell price for one trading pair at a time
- Set an order size (in quote currency, e.g. USDT)
- Automatically alternate buy and sell limit orders as the market crosses each trigger (ping-pong)
- Start/Pause the bot (kill switch)
- Demo-trading mode (OKX simulated trading) toggled by an environment variable
- A dark dashboard showing bot status, live price, balances, strategy, P&L estimate, open orders, and trade history

**Out of scope (for now):**

- Multiple simultaneous pairs/strategies (the dashboard is currently fixed to `BTC-USDT`)
- Trailing stops, DCA, grid trading, stop-loss, or any advanced order logic
- Multi-exchange support
- Backtesting or historical simulation
- Notifications (email/Telegram/etc.) - for now just console logs and the dashboard log

---

## Tech Stack

- **Python** - the bot engine and API. FastAPI + uvicorn serve the REST API, `httpx` talks to OKX, `pydantic-settings` loads configuration. This is the core of Yuna.
- **Next.js 16 / React 19 / TypeScript / Tailwind CSS v4** - the dashboard. A single page that polls the Python backend over REST every 5 seconds.
- **Local JSON file** - `backend/data.json` stores settings, bot status and trade history. No database yet.
- **Go** - not used in the MVP. Held in reserve only if a specific piece later needs lower latency or concurrency than Python comfortably gives (e.g. a dedicated price-feed service).
- **Docker** - not used in the MVP. Local dev runs the backend and frontend directly. Containerization gets added when running Yuna 24/7 on a VPS makes it worthwhile.

---

## Architecture Overview

```
+-------------------+      REST (poll 5s)      +----------------------+
|   Next.js UI      | <----------------------> |   Python Bot Engine  |
|  (dashboard)      |   http://localhost:8000  |   (FastAPI + loop)   |
+-------------------+                          +----------------------+
                                                        |
                                                        | signed REST
                                                        v
                                                +----------------------+
                                                |       OKX API        |
                                                +----------------------+
```

- The FastAPI app starts the **bot loop** as a background task at startup. The loop polls OKX every 10 seconds, compares the price to the saved triggers and places limit orders (see [How Yuna Trades](#how-yuna-trades-basic-ping-pong)).
- Every OKX request is signed with HMAC-SHA256 (`OK-ACCESS-*` headers). When `OKX_SIMULATED=1`, the `x-simulated-trading: 1` header is added so orders go to OKX demo trading.
- Settings, bot status and trade history are persisted to `backend/data.json`, so they survive restarts.
- The Next.js frontend is a thin client: it renders state, sends config changes (triggers, order size, start/pause) and polls for updates. No trading logic lives in the frontend. The one exception is the P&L figure, which is estimated client-side from the trade history.

### REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/status` | Bot status (`active` / `paused` / `error`) and saved settings |
| POST | `/api/settings` | Save pair, buy/sell triggers, order size (also re-arms both sides) |
| POST | `/api/bot/start` | Set bot status to `active` |
| POST | `/api/bot/pause` | Set bot status to `paused` (kill switch) |
| GET | `/api/market/price?inst_id=BTC-USDT` | Latest price from OKX |
| GET | `/api/balances` | Available balance per currency |
| GET | `/api/orders/pending?inst_id=BTC-USDT` | Open orders sitting on OKX |
| GET | `/api/trades/history` | Trades logged by the bot |

---

## UI Spec

The dashboard is a single dark page (zinc palette) centred in a `max-w-5xl` column. It refreshes itself every 5 seconds.

**Colour convention:** **rose = buy**, **emerald = sell**, zinc for neutral text. The same mapping is used on the trigger cards, the settings inputs, open orders and the log.

### 1. Status banner & controls

- **Bot status badge:** Active (green) / Paused (yellow) / Error (red)
- **⚙ SETTINGS** button opens the settings drawer (below)
- **Kill switch:** one button toggles *PAUSE BOT / KILL SWITCH* ↔ *START BOT*

### 2. Settings drawer (slides in from the left)

Opened with the **⚙ SETTINGS** button. The strategy parameters live here instead of taking up space on the page:

- Buy Trigger Price, Sell Trigger Price, Order Size (USDT)
- **SAVE & APPLY** saves the settings and closes the drawer
- Smooth slide-in/out animation with a dimmed, blurred backdrop; click the backdrop or **✕** to close; respects the OS "reduce motion" setting

### 3. Strategy & performance panel

- **Active Trading Strategy:** current buy trigger (rose), sell trigger (emerald) and allocation size
- **Completed ping-pong cycles:** number of finished buy → sell round trips
- **Net realized P/L:** estimated profit or loss in USDT, plus a ≈ USD equivalent (see [Activity Tracking](#activity-tracking) for how it is calculated)

### 4. Hero cards

Two large cards, the most prominent elements on the page:

- **Current ticker price:** big live price with a pulsing "live" dot
- **Market:** the trading pair (currently `BTC-USDT`)

### 5. Account balances

A side panel listing the available balance of every currency in the OKX account.

### 6. Activity tracking

- **Open Orders:** orders currently resting on OKX
- **Recent Logs:** scrollable list of the bot's trades, newest first

```
+----------------------------------------------------------+---------------+
| [BOT STATUS: ACTIVE]        [⚙ SETTINGS] [PAUSE BOT]     | ACCOUNT       |
+----------------------------------------------------------+ BALANCES      |
| ACTIVE TRADING STRATEGY                                  |               |
| [BUY TRIGGER] [SELL TRIGGER] [ALLOCATION SIZE]           | USDT  ...     |
| PERFORMANCE & LOG TRACKER                                | BTC   ...     |
| [COMPLETED CYCLES]   [NET REALIZED P/L]                  |               |
+----------------------------------------------------------+               |
| [● CURRENT TICKER PRICE]        [MARKET: BTC-USDT]       |               |
+----------------------------------------------------------+---------------+
| OPEN ORDERS                                                              |
|  BUY @ 85350 (0.000586)                                                  |
+--------------------------------------------------------------------------+
| RECENT LOGS                                                              |
|  [2026-10-04 8:12:50 PM] BUY @ $85350 — 50 USDT (0.000586 BTC)           |
|  [2026-10-04 8:11:57 PM] SELL @ $85400 — 1.000935 BTC                    |
+--------------------------------------------------------------------------+
```

---

## Activity Tracking

Yuna keeps three layers of activity information.

### Trade history (the Recent Logs)

Every time the bot places an order it appends an entry to `trade_history` in `backend/data.json`, and the dashboard shows it as:

```
[2026-10-04 8:12:50 PM] BUY @ $85350 — 50 USDT (0.000586 BTC)
```

| Field | Meaning |
|---|---|
| `timestamp` | Unix time the order was placed (shown as date + time) |
| `side` | `buy` (rose) or `sell` (emerald) |
| `price` | Buy: the trigger price. Sell: the market price at the time of the sell |
| `size` | Buy: `<USDT> USDT (<BTC> BTC)`. Sell: `<BTC> BTC` |
| `status_msg` | `FULFILLED ON <local time>`. Stored in the file but not shown in the UI |

An entry means the order was **placed successfully**; Yuna does not yet re-check OKX to confirm that it filled.

### Open orders

Fetched live from OKX (`/api/trade/orders-pending`), so this shows what is actually resting on the exchange. Because Yuna's limit orders are usually marketable and fill immediately, this list is often empty.

### Performance panel (P&L estimate)

Calculated in the browser from the trade history:

- **Spent** = sum of the USDT order size of every buy
- **Received** = BTC sold × sell price, summed over every sell. If a single sell is larger than 0.5 BTC (e.g. the first sell sweeping a whole demo-account balance), only the BTC volume of the most recent buy is counted, so a pre-existing balance doesn't distort the number
- **Net realized P/L** = Received − Spent, in USDT
- **≈ USD** = Net × a fixed USDT→USD rate (`0.9998`, set in `page.tsx`)
- **Completed cycles** = `min(number of buys, number of sells)`

This is an estimate: it ignores fees and slippage, assumes each sell closes the previous buy, and the 0.5 BTC threshold and fixed USD rate are hard-coded for now.

### Console logs

The backend prints a line each cycle, e.g. `[bot_loop] checked BTC-USDT @ 85347.3 (buy_trigger=..., sell_trigger=...)`, plus `BUY order placed`, `SELL order successfully executed`, `Sell skipped`, and any OKX error with its code. If nothing prints at all, the bot isn't `active`.

---

## Project Structure

```
yuna/
├── backend/
│   ├── main.py            # FastAPI app, REST endpoints, starts the bot loop
│   ├── okx_client.py      # OKX wrapper: signing, ticker, balance, orders, fills
│   ├── bot_loop.py        # Polling loop + ping-pong trigger logic
│   ├── store.py           # Reads/writes data.json (settings, status, history)
│   ├── config.py          # Loads environment variables from .env
│   ├── data.json          # Runtime state (auto-created if missing)
│   ├── .env_example       # Template for your .env
│   ├── requirements.txt   # Python dependencies
│   └── test_okx.py        # Scratch script for checking key loading
├── frontend/
│   ├── app/
│   │   ├── page.tsx       # The whole dashboard (client component)
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── lib/api.ts         # Client for the Python backend (http://localhost:8000)
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 20.9+ (required by Next.js 16)
- An OKX account with an API key. **Start with a demo-trading key** (below).

### 1. Create an OKX API key

In OKX, switch to **Demo Trading** and create an API key there. Give it **Read** and **Trade** permissions (never Withdraw). Keep the key, secret and passphrase. Demo and live keys are separate; a key without Trade permission fails on the first order with `401` / code `50123`.

### 2. Set up the backend

```bash
cd backend
python -m venv venv

# activate the virtual environment
venv\Scripts\activate            # Windows (PowerShell: .\venv\Scripts\Activate.ps1)
source venv/bin/activate         # macOS / Linux

pip install -r requirements.txt

copy .env_example .env           # Windows
cp .env_example .env             # macOS / Linux
```

Edit `backend/.env` with your credentials (see [Configuration](#configuration)). Never commit this file.

### 3. Run the backend

Run from inside the `backend` folder (imports and `.env` / `data.json` are resolved relative to it):

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

You should see `[main] bot_loop task started`.

> The bot resumes whatever status was saved in `data.json`. If it was left `active`, it starts watching and trading as soon as the backend starts.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Use the dashboard

1. Open http://localhost:3000
2. Click **⚙ SETTINGS**, enter a buy trigger, sell trigger and order size, then **SAVE & APPLY**
3. Click **START BOT**

### Quick test: make Yuna buy

Using demo mode, set the **buy trigger slightly above the current price**. The bot buys when `price <= buy_trigger`, so it fires on the next 10-second pass. Keep the sell trigger far away (e.g. `999999`) so only the buy fires, check the trade appears in Recent Logs and in your OKX demo order history, then press **PAUSE BOT**.

---

## Configuration

Set in `backend/.env`:

| Variable | Default | Description |
|---|---|---|
| `OKX_API_KEY` | required | OKX API key |
| `OKX_API_SECRET` | required | OKX API secret |
| `OKX_API_PASSPHRASE` | required | Passphrase chosen when the key was created |
| `OKX_BASE_URL` | `https://www.okx.com` | OKX domain to call. Use the one that matches your account's region (the example file uses `https://my.okx.com`) |
| `OKX_SIMULATED` | `true` | `1` sends the demo-trading header so orders go to the OKX demo account. Use a demo key with this on, and a live key with it off |

The frontend expects the backend at `http://localhost:8000`, and the backend only allows CORS from `http://localhost:3000`.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `[OKX ERROR] 401 ... code 50123` | The API key has no Trade permission (or belongs to a different environment than `OKX_SIMULATED`) |
| `Unable to connect to the remote server` on `localhost:8000` | Backend isn't running, or wasn't started from inside `backend/` |
| Dashboard status shows **ERROR** | A price fetch failed; the loop stays in `error` until you press **START BOT** |
| Nothing prints and no orders are placed | Bot isn't `active`, or the trigger isn't crossed (a buy needs `price <= buy trigger`, a sell needs `price >= sell trigger`) |

---

## Known Limitations

- Single pair only; the dashboard hardcodes `BTC-USDT`
- Sells the entire available BTC balance, not just what Yuna bought
- Logs on order placement; fills are not confirmed with OKX
- Fired flags are in memory, so a backend restart re-arms both sides (it can buy again immediately if the price is below the buy trigger)
- P&L is a client-side estimate without fees
- No stop-loss, authentication on the API, or HTTPS; intended for local use only

---

## Roadmap (post-MVP)

- Confirm fills with OKX (`/trade/fills`) and log real executed prices and fees
- Persist the fired state so restarts don't re-trigger
- Sell only the quantity Yuna bought, and add a stop-loss
- Notifications on fills (Telegram/email)
- Multi-pair support and a pair selector in the UI
- Dockerized deployment for always-on running
- More order types (OCO, trailing)