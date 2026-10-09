# Yuna session summary

## 04.10.2026, Sunday

1. **OKX 401 error (code 50123)**
   - **Challenge:** The first buy order was rejected because the API key had no trading permission.
   - **Solution:** After tracing the error to the key's permissions on OKX's side, I set up a demo key with USDT trading enabled (only BTC was selected), and orders later went through.

2. **Awkward gap and full-width stretch**
   - **Challenge:** The hero cards left a gap above Open Orders, and the content ran edge to edge.
   - **Solution:** I centred the page with a `max-w-5xl` wrapper, made the left column a flex column so the hero cards grow, and dropped `h-full` and `pt-2`.

3. **Drawer not animating**
   - **Challenge:** The settings drawer snapped open and closed instead of sliding.
   - **Solution:** I transitioned the `translate` property instead of `transform`, since Tailwind v4 uses `translate`, and added a smoother easing curve.

**Still open:** the sell branch's `continue` skips the 10-second sleep when I hold no BTC, so the loop would call OKX nonstop in that case.


## 08.10.2026, Thursday

1. Sell branch hammered OKX when I held no BTC
   - **Challenge:** The "insufficient BTC balance" path in the sell branch used continue, which jumped back to the top of the loop and skipped the 10-second sleep, so the bot called OKX nonstop while price was above the sell trigger and I held no BTC.
   - **Solution:** I added await asyncio.sleep(POLL_INTERVAL_SECONDS) before that continue in bot_loop.py.

2. P&L and cycle count came from the local log instead of real fills
   - **Challenge:** calculatePnL read trade_history, which is written when an order is placed, so unfilled orders were counted. It also relied on a hardcoded BTC fallback and a > 0.5 hack to cope with the sell that swept the whole demo balance. The plain OKX fills endpoint only reaches back 3 days, so it would have shown nothing for the 04.10 trades.
   - **Solution:** I switched get_fills() in okx_client.py to /api/v5/trade/fills-history (about 3 months, instType=SPOT required, up to 100 rows). In page.tsx, calculatePnL now runs on the fills: it sorts them by time, matches each sell against earlier buys first-in-first-out, and includes fees (a fee in BTC reduces the quantity bought, a fee in USDT adjusts cost or proceeds). Sold quantity with no matching buy, such as the demo account's starting BTC, has no cost basis and is left out. A completed cycle is a sell order that closed bought quantity, counted once per order so partial fills don't inflate it. I removed the unused history state and the getTradeHistory call from the dashboard.

**Still open:** fills-history returns at most 100 rows per request and I don't paginate, so a very busy account would be truncated. bot_loop.py still writes trade_history to data.json; the dashboard no longer reads it. Hard to view all filled orders.


## 10.10.2026, Saturday

1. **Stop-loss setting value failed to reset/clear when left empty**
   - **Challenge:** Leaving the Stop-Loss input field empty in the UI drawer failed to clear `"stop_loss"` in `data.json`[cite: 1]. It either evaluated to `NaN` in JavaScript, required entering `"0"` to show `DISABLED`, or left the old value unchanged in `data.json`[cite: 1].
   - **Solution:** Traced the issue to three root causes across the stack:
     1. **`backend/main.py`:** The `/api/settings` endpoint used `payload.dict(exclude_none=True)`, which stripped `null` fields out of the payload before updating `data.json`, preventing existing settings from being reset to `None`[cite: 1].
     2. **`frontend/app/page.tsx`:** `saveSettings()` now explicitly maps empty strings / `NaN` inputs to `null` instead of passing invalid values[cite: 1].
     3. **`frontend/app/page.tsx`:** Added a `useEffect` hook to sync the drawer's input state with `status.settings` so existing settings load properly when refreshing or opening the drawer[cite: 1].

**Still open:**
   - The stop-loss trigger logic in `backend/bot_loop.py` still needs to be fully integrated and end-to-end tested in OKX Demo Trading to ensure it executes a limit sell for `last_bought_qty` when market price drops to or below `stop_loss`[cite: 1].
   - fills-history returns at most 100 rows per request and I don't paginate, so a very busy account would be truncated. bot_loop.py still writes trade_history to data.json; the dashboard no longer reads it. Hard to view all filled orders.