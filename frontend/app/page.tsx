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
    <main className="p-6 max-w-2xl mx-auto space-y-6 font-mono">
      <div className="flex justify-between items-center border p-4 rounded">
        <span className={`px-3 py-1 rounded text-white ${statusColor}`}>
          BOT STATUS: {status?.bot_status?.toUpperCase()}
        </span>
        <button onClick={toggleBot} className="border px-4 py-2 rounded bg-red-100">
          {status?.bot_status === "active" ? "PAUSE BOT / KILL SWITCH" : "START BOT"}
        </button>
      </div>

      <div className="border p-4 rounded">
        <p>MARKET: {instId}   CURRENT PRICE: ${price}</p>
        <p>BALANCES: {balances && Object.entries(balances).map(([k, v]) => `${v} ${k}`).join("  |  ")}</p>
      </div>

      {/* ACTIVE STRATEGY & PERFORMANCE MONITORING PANEL */}
      <div className="border border-white-200 bg-50/50 p-4 rounded space-y-4">
        <div>
          <p className="font-bold text-white-900 flex items-center gap-2">
            🌐 ACTIVE TRADING STRATEGY
          </p>
          <div className="grid grid-cols-3 gap-4 text-sm font-mono mt-2">
            <div className="p-2 rounded">
              <span className="text-gray-500 block text-xs">BUY TRIGGER</span>
              <span className="text-green-600 font-bold text-base">
                {status?.settings?.buy_trigger ? `$${status.settings.buy_trigger}` : "NOT SET"}
              </span>
            </div>
            <div className="p-2 rounded">
              <span className="text-gray-500 block text-xs">SELL TRIGGER</span>
              <span className="text-red-600 font-bold text-base">
                {status?.settings?.sell_trigger ? `$${status.settings.sell_trigger}` : "NOT SET"}
              </span>
            </div>
            <div className="p-2 rounded">
              <span className="text-gray-500 block text-xs">ALLOCATION SIZE</span>
              <span className="text-white-900 font-bold text-base">
                {status?.settings?.order_size ? `${status.settings.order_size} USDT` : "NOT SET"}
              </span>
            </div>
          </div>
        </div>

        {/* PERFORMANCE & PNL ENGINE METRICS */}
        <div className="border-t pt-3 border-white-100">
          <p className="font-bold text-white-800 text-sm flex items-center gap-2">
            📊 PERFORMANCE & LOG TRACKER
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm font-mono mt-2">
            <div className="p-2 rounded">
              <span className="text-gray-500 block text-xs">COMPLETED PING-PONG CYCLES</span>
              <span className="text-600 font-bold text-lg">{pnl.completedCycles} trades</span>
            </div>
            <div className="p-2 rounded">
              <span className="text-gray-500 block text-xs">NET REALIZED PROFIT / LOSS</span>
              <span className={`font-bold text-lg ${pnl.netUsdt >= 0 ? "text-green-600" : "text-red-600"}`}>
                {pnl.netUsdt >= 0 ? `+${pnl.netUsdt.toFixed(4)}` : `-${Math.abs(pnl.netUsdt).toFixed(4)}`} USDT
              </span>
              {/* TINY FIAT EQUIVALENT DISPLAY ROW */}
              <div className="text-[11px] text-gray-500 mt-1 font-mono tracking-tight pt-1 border-gray-50">
                  ≈ {netUsdEquivalent >= 0 ? `+$${netUsdEquivalent.toFixed(4)}` : `-$${Math.abs(netUsdEquivalent).toFixed(4)}`} USD
              </div>
            </div>
          </div>
        </div>
      </div>
    


      <div className="border p-4 rounded space-y-2">
        <p className="font-bold">STRATEGY SETTINGS</p>
        <input placeholder="Buy Trigger Price" value={buyTrigger}
          onChange={e => setBuyTrigger(e.target.value)} className="border p-1 w-full" />
        <input placeholder="Sell Trigger Price" value={sellTrigger}
          onChange={e => setSellTrigger(e.target.value)} className="border p-1 w-full" />
        <input placeholder="Order Size" value={orderSize}
          onChange={e => setOrderSize(e.target.value)} className="border p-1 w-full" />
        <button onClick={saveSettings} className="border px-4 py-1 rounded bg-blue-100">
          SAVE & APPLY
        </button>
      </div>

      <div className="border p-4 rounded">
        <p className="font-bold">OPEN ORDERS</p>
        {orders.map((o, i) => (
          <p key={i}>{o.side.toUpperCase()} @ {o.px} ({o.sz})</p>
        ))}
      </div>

      <div className="border p-4 rounded max-h-48 overflow-y-auto">
        <p className="font-bold">RECENT LOGS</p>
        {history.slice().reverse().map((t, i) => (
        <p key={i} className="text-sm border-b py-1 last:border-0 font-mono">
          <span className="text-gray-500">[{new Date(t.timestamp * 1000).toLocaleTimeString()}]</span>{" "}
          <span className={t.side === "buy" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
            {t.side.toUpperCase()}
          </span>{" "}
          @ ${t.price} — <span className="text-gray-700">{t.size}</span>{" "}
          {t.status_msg && (
            <span className="text-blue-600 font-bold bg-blue-50 px-1 rounded text-xs ml-2">
              {t.status_msg}
            </span>
          )}
        </p>
        ))}
      </div>

    </main>
  );
}