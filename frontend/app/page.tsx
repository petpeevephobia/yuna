"use client";

import { useEffect, useState } from "react";
import {
  getStatus, postSettings, startBot, pauseBot,
  getMarketPrice, getBalances, getPendingOrders, getFilledOrders,
} from "@/lib/api";

export default function Dashboard() {
  const [status, setStatus] = useState<any>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [balances, setBalances] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [fills, setFills] = useState<any[]>([]);

  const [buyTrigger, setBuyTrigger] = useState("");
  const [sellTrigger, setSellTrigger] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [orderSize, setOrderSize] = useState("");

  const instId = "BTC-USDT";
  const baseCcy = instId.split("-")[0];

  async function refresh() {
    setStatus(await getStatus());
    setPrice((await getMarketPrice(instId)).price);
    setBalances(await getBalances());
    const open = await getPendingOrders(instId);
    setOrders(Array.isArray(open) ? open : []);
    const filled = await getFilledOrders(instId);
    setFills(Array.isArray(filled) ? filled : []);
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  async function saveSettings() {
    const parsedBuy = parseFloat(buyTrigger);
    const parsedSell = parseFloat(sellTrigger);
    const parsedSL = parseFloat(stopLoss);
  
    await postSettings({
      inst_id: instId,
      buy_trigger: !isNaN(parsedBuy) ? parsedBuy : null,
      sell_trigger: !isNaN(parsedSell) ? parsedSell : null,
      stop_loss: !isNaN(parsedSL) && parsedSL > 0 ? parsedSL : null,       // Sets null if empty or 0
      order_size: orderSize,
    });
    refresh();
  }

  async function toggleBot() {
    if (status?.bot_status === "active") await pauseBot();
    else await startBot();
    refresh();
  }

  const statusColor = {
    active: "bg-green-500",
    paused: "bg-yellow-500",
    error: "bg-red-500",
  }[status?.bot_status ?? "paused"];

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Realized P&L from real OKX fills, FIFO-matched: every sell is matched against
  // earlier buys. Sold quantity with no matching buy in the fill history (e.g. the
  // demo account's starting BTC) has no cost basis, so it is left out.
  const calculatePnL = () => {
    const [base, quote] = instId.split("-");
    const ordered = fills.slice().sort((a: any, b: any) => Number(a.ts) - Number(b.ts));

    const lots: { qty: number; unitCost: number }[] = [];
    const closedOrders = new Set<string>();
    let netUsdt = 0;

    ordered.forEach((f: any, i: number) => {
      const px = parseFloat(f.fillPx);
      const sz = parseFloat(f.fillSz);
      const fee = parseFloat(f.fee) || 0; // OKX reports fees as negative numbers
      if (isNaN(px) || isNaN(sz) || sz <= 0) return;
      const feeBase = f.feeCcy === base ? fee : 0;
      const feeQuote = f.feeCcy === quote ? fee : 0;

      if (f.side === "buy") {
        const qty = sz + feeBase; // a fee taken in BTC reduces what we actually hold
        if (qty <= 0) return;
        lots.push({ qty, unitCost: (px * sz - feeQuote) / qty });
      } else if (f.side === "sell") {
        const proceeds = px * sz + feeQuote;
        let remaining = sz;
        let matched = 0;
        let matchedCost = 0;
        while (remaining > 1e-12 && lots.length > 0) {
          const lot = lots[0];
          const take = Math.min(lot.qty, remaining);
          matchedCost += take * lot.unitCost;
          matched += take;
          remaining -= take;
          lot.qty -= take;
          if (lot.qty <= 1e-12) lots.shift();
        }
        if (matched > 0) {
          netUsdt += proceeds * (matched / sz) - matchedCost;
          closedOrders.add(String(f.ordId ?? `fill-${i}`));
        }
      }
    });

    return { netUsdt, completedCycles: closedOrders.size };
  };



  // 1. Establish the current real-time exchange baseline parameter
  const USDT_TO_USD_RATE = 0.9998; 

  const pnl = calculatePnL();
  
  // 2. Compute the precise USD equivalent value
  const netUsdEquivalent = pnl.netUsdt * USDT_TO_USD_RATE;

  // OKX timestamps are epoch milliseconds (as strings)
  const fmtTs = (ms: string | number | undefined) => {
    const d = new Date(Number(ms));
    if (!ms || isNaN(d.getTime())) return "";
    return `[${d.toLocaleDateString("sv-SE")} ${d.toLocaleTimeString()}]`;
  };
  
  

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono [color-scheme:dark]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
  
          {/* LEFT COLUMN */}
          <div className="flex min-w-0 flex-col gap-6 md:col-span-3">
  
            {/* BOT STATUS BANNER */}
            <div className="flex justify-between items-center rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-white ${statusColor}`}>
                BOT STATUS: {status?.bot_status?.toUpperCase()}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-semibold tracking-wider text-zinc-400 transition-colors hover:bg-zinc-500/20 cursor-pointer"
                >
                  ⚙
                </button>
                <button
                  onClick={toggleBot}
                  className={`rounded-lg border px-4 py-2 text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
                    status?.bot_status === "active"
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                  }`}
                >
                  {status?.bot_status === "active" ? "PAUSE BOT" : "START BOT"}
                </button>
              </div>
            </div>
  
            {/* ACTIVE STRATEGY & PERFORMANCE PANEL */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-5">
              <div>
                <p className="text-xs font-semibold tracking-widest text-zinc-300">
                  🌐 ACTIVE TRADING STRATEGY
                </p>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                    <span className="block text-[10px] tracking-widest text-zinc-500">BUY TRIGGER</span>
                    <span className="mt-1 block text-base font-bold text-rose-400">
                      {status?.settings?.buy_trigger ? `$${status.settings.buy_trigger}` : "NOT SET"}
                    </span>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                    <span className="block text-[10px] tracking-widest text-zinc-500">SELL TRIGGER</span>
                    <span className="mt-1 block text-base font-bold text-emerald-400">
                      {status?.settings?.sell_trigger ? `$${status.settings.sell_trigger}` : "NOT SET"}
                    </span>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                    <span className="block text-[10px] tracking-widest text-zinc-500">STOP LOSS</span>
                    <span className="mt-1 block text-base font-bold text-red-400">
                      {status?.settings?.stop_loss ? `$${status.settings.stop_loss}` : "DISABLED"}
                    </span>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                    <span className="block text-[10px] tracking-widest text-zinc-500">ALLOCATION SIZE</span>
                    <span className="mt-1 block text-base font-bold text-zinc-100">
                      {status?.settings?.order_size ? `${status.settings.order_size} USDT` : "NOT SET"}
                    </span>
                  </div>
                </div>
              </div>
  
              <div className="border-t border-zinc-800 pt-4">
                <p className="text-xs font-semibold tracking-widest text-zinc-300">
                  📊 PERFORMANCE & LOG TRACKER
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                    <span className="block text-[10px] tracking-widest text-zinc-500">COMPLETED PING-PONG CYCLES</span>
                    <span className="mt-1 block text-lg font-bold text-zinc-100">{pnl.completedCycles} trades</span>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 flex flex-col justify-between">
                    <div>
                      <span className="block text-[10px] tracking-widest text-zinc-500">NET REALIZED PROFIT / LOSS</span>
                      <span className={`mt-1 block text-lg font-bold leading-none ${pnl.netUsdt >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {pnl.netUsdt >= 0 ? `+$${pnl.netUsdt.toFixed(4)}` : `-$${Math.abs(pnl.netUsdt).toFixed(4)}`} USDT
                      </span>
                    </div>
                    <div className="mt-2 border-t border-zinc-800 pt-1 text-[11px] tracking-tight text-zinc-500">
                      ≈ {netUsdEquivalent >= 0 ? `+$${netUsdEquivalent.toFixed(4)}` : `-$${Math.abs(netUsdEquivalent).toFixed(4)}`} USD
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* MARKET + PRICE HERO CARDS */}
            <div className="grid min-h-[180px] flex-1 grid-cols-1 gap-4 sm:grid-cols-2">

            {/* CURRENT TICKER PRICE */}
            <div className="flex flex-col justify-center rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-zinc-900 p-6 shadow-[0_0_40px_-12px_rgba(16,185,129,0.45)]">
              <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-emerald-300/70">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                CURRENT TICKER PRICE
              </span>
              <span className="mt-3 block text-4xl font-extrabold tabular-nums tracking-tight text-emerald-300 md:text-5xl">
                ${price}
              </span>
            </div>

            {/* MARKET */}
            <div className="flex flex-col justify-center rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-zinc-900 to-zinc-900 p-6 shadow-[0_0_40px_-12px_rgba(14,165,233,0.45)]">
              <span className="block text-[11px] font-semibold tracking-[0.25em] text-sky-300/70">
                MARKET
              </span>
              <span className="mt-3 block text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                {instId}
              </span>
            </div>

            </div>
  
          </div>
  
          {/* RIGHT COLUMN: BALANCES */}
          <div className="md:col-span-1 h-full min-h-[350px] rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
            <p className="border-b border-zinc-800 pb-2 text-xs font-semibold tracking-widest text-zinc-300">
              🧮 ACCOUNT BALANCES
            </p>
            <div className="flex flex-col gap-3">
              {balances && Object.entries(balances).map(([asset, balanceValue]: [string, any]) => (
                <div key={asset} className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                  <span className="block text-[10px] font-bold tracking-widest text-zinc-500">{asset}</span>
                  <span className="mt-1 text-lg font-bold tracking-tight text-zinc-100">
                    {typeof balanceValue === "number"
                      ? balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
                      : balanceValue}
                  </span>
                </div>
              ))}
              {!balances && (
                <p className="text-xs italic text-zinc-600">Streaming wallet data parameters...</p>
              )}
            </div>
          </div>
  
        </div>
  
        {/* FOOTER: ORDERS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* OPEN ORDERS: resting on OKX, not executed yet */}
          <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 [scrollbar-color:#3f3f46_transparent]">
            <p className="mb-2 text-xs font-semibold tracking-widest text-zinc-300">OPEN ORDERS</p>
            {orders.length === 0 && <p className="text-xs italic text-zinc-600">No open orders</p>}
            {orders.map((o, i) => (
              <p key={o.ordId ?? i} className="border-b border-zinc-800 py-1.5 text-sm last:border-0">
                <span className="text-zinc-500">{fmtTs(o.cTime)}</span>{" "}
                <span className={o.side === "buy" ? "font-bold text-rose-400" : "font-bold text-emerald-400"}>
                  {o.side.toUpperCase()}
                </span>{" "}
                <span className="text-zinc-300">@ ${o.px}</span>{" "}
                <span className="text-zinc-500">— {o.sz} {baseCcy}</span>
              </p>
            ))}
          </div>

          {/* FILLED ORDERS: trades OKX actually executed */}
          <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 [scrollbar-color:#3f3f46_transparent]">
            <p className="mb-2 text-xs font-semibold tracking-widest text-zinc-300">FILLED ORDERS</p>
            {fills.length === 0 && <p className="text-xs italic text-zinc-600">No filled orders yet</p>}
            {fills
              .slice()
              .sort((a, b) => Number(b.ts) - Number(a.ts))
              .map((f, i) => (
                <p key={f.tradeId ?? i} className="border-b border-zinc-800 py-1.5 text-sm last:border-0">
                  <span className="text-zinc-500">{fmtTs(f.ts)}</span>{" "}
                  <span className={f.side === "buy" ? "font-bold text-rose-400" : "font-bold text-emerald-400"}>
                    {f.side.toUpperCase()}
                  </span>{" "}
                  <span className="text-zinc-300">@ ${f.fillPx}</span>{" "}
                  <span className="text-zinc-500">— {f.fillSz} {baseCcy}</span>
                  {f.fee && (
                    <span className="text-zinc-600"> · fee {f.fee} {f.feeCcy}</span>
                  )}
                </p>
              ))}
          </div>

        </div>
  
      </div>
  
      {/* SETTINGS DRAWER */}
      <div
        onClick={() => setSettingsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          settingsOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-hidden={!settingsOpen}
        className={`fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] border-r border-zinc-800 bg-zinc-900 p-6 shadow-2xl will-change-transform transition-[translate,visibility] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
          settingsOpen ? "translate-x-0 visible" : "-translate-x-full invisible"
        }`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-zinc-800 pb-3">
          <p className="text-xs font-semibold tracking-widest text-zinc-300">STRATEGY PARAMETER SETTINGS</p>
          <button
            onClick={() => setSettingsOpen(false)}
            className="text-zinc-500 transition-colors hover:text-zinc-200 cursor-pointer"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>
  
        <div className="space-y-3">
          <input
            placeholder="Buy Trigger Price"
            value={buyTrigger}
            onChange={e => setBuyTrigger(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-rose-500/60"
          />
          <input
            placeholder="Sell Trigger Price"
            value={sellTrigger}
            onChange={e => setSellTrigger(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/60"
          />
          <input
            placeholder="Stop-Loss Price (leave empty to remove)"
            value={stopLoss}
            onChange={e => setStopLoss(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-red-500/60"
          />
          <input
            placeholder="Order Size"
            value={orderSize}
            onChange={e => setOrderSize(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-sky-500/60"
          />
          <button
            onClick={async () => {
              await saveSettings();
              setSettingsOpen(false);
            }}
            className="w-full rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-sky-300 transition-colors hover:bg-sky-500/20 cursor-pointer"
          >
            SAVE & APPLY
          </button>
        </div>
      </aside>
    </main>
  );

}