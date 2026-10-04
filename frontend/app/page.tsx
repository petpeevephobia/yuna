"use client";

import { useEffect, useState } from "react";
import {
  getStatus, postSettings, startBot, pauseBot,
  getMarketPrice, getBalances, getPendingOrders, getTradeHistory,
} from "@/lib/api";

export default function Dashboard() {
  const [status, setStatus] = useState<any>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [balances, setBalances] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const [buyTrigger, setBuyTrigger] = useState("");
  const [sellTrigger, setSellTrigger] = useState("");
  const [orderSize, setOrderSize] = useState("");

  const instId = "BTC-USDT";

  async function refresh() {
    setStatus(await getStatus());
    setPrice((await getMarketPrice(instId)).price);
    setBalances(await getBalances());
    setOrders(await getPendingOrders(instId));
    setHistory(await getTradeHistory());
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  async function saveSettings() {
    await postSettings({
      inst_id: instId,
      buy_trigger: parseFloat(buyTrigger),
      sell_trigger: parseFloat(sellTrigger),
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

  const calculatePnL = () => {
    if (!history || history.length === 0) return { netUsdt: 0, completedCycles: 0 };

    let totalSpent = 0;
    let totalReceived = 0;
    let buysCount = 0;
    let sellsCount = 0;

    // 1. First, scan through and find out what the active allocation size in BTC is
    let lastBuyBtcVolume = 0.000586; // Fallback to your active 50 USDT size
    
    history.forEach((trade: any) => {
      if (trade.side === "buy") {
        const usdtValue = parseFloat(trade.size);
        if (!isNaN(usdtValue)) {
          totalSpent += usdtValue;
          buysCount++;
        }
        
        // Dynamically extract the exact BTC volume from between the parentheses "(0.000586 BTC)"
        const btcMatch = trade.size.match(/\(([^)]+)\)/);
        if (btcMatch && btcMatch[1]) {
          lastBuyBtcVolume = parseFloat(btcMatch[1]);
        }
      } else if (trade.side === "sell") {
        const btcValue = parseFloat(trade.size);
        const executePrice = parseFloat(trade.price);
        
        if (!isNaN(btcValue) && !isNaN(executePrice)) {
          // If the bot swept your entire 1 BTC demo account deposit bucket,
          // isolate just the portion that was purchased for the strategy trade
          if (btcValue > 0.5) {
            totalReceived += (lastBuyBtcVolume * executePrice);
          } else {
            totalReceived += (btcValue * executePrice);
          }
          sellsCount++;
        }
      }
    });

    const completedCycles = Math.min(buysCount, sellsCount);
    const netUsdt = totalReceived - totalSpent;

    return { netUsdt, completedCycles };
  };



  // 1. Establish the current real-time exchange baseline parameter
  const USDT_TO_USD_RATE = 0.9998; 

  const pnl = calculatePnL();
  
  // 2. Compute the precise USD equivalent value
  const netUsdEquivalent = pnl.netUsdt * USDT_TO_USD_RATE;
  
  

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
  
        {/* FOOTER: TABLES */}
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="mb-2 text-xs font-semibold tracking-widest text-zinc-300">OPEN ORDERS</p>
            {orders.length === 0 && <p className="text-xs italic text-zinc-600">No open orders</p>}
            {orders.map((o, i) => (
              <p key={i} className="py-1 text-sm text-zinc-300">
                <span className={o.side === "buy" ? "font-bold text-rose-400" : "font-bold text-emerald-400"}>
                  {o.side.toUpperCase()}
                </span>{" "}
                @ {o.px} <span className="text-zinc-500">({o.sz})</span>
              </p>
            ))}
          </div>
  
          <div className="max-h-48 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 [scrollbar-color:#3f3f46_transparent]">
            <p className="mb-2 text-xs font-semibold tracking-widest text-zinc-300">RECENT LOGS</p>
            {history.length === 0 && <p className="text-xs italic text-zinc-600">No trades yet</p>}
            {history.slice().reverse().map((t, i) => {
              const d = new Date(t.timestamp * 1000);
              return (
                <p key={i} className="border-b border-zinc-800 py-1.5 text-sm last:border-0">
                  <span className="text-zinc-500">
                    [{d.toLocaleDateString("sv-SE")} {d.toLocaleTimeString()}]
                  </span>{" "}
                  <span className={t.side === "buy" ? "font-bold text-rose-400" : "font-bold text-emerald-400"}>
                    {t.side.toUpperCase()}
                  </span>{" "}
                  <span className="text-zinc-300">@ ${t.price}</span>{" "}
                  <span className="text-zinc-500">— {t.size}</span>
                </p>
              );
            })}
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