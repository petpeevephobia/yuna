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
          <p key={i}>
            [{new Date(t.timestamp * 1000).toLocaleTimeString()}] {t.side.toUpperCase()} {t.size} @ {t.price}
          </p>
        ))}
      </div>
    </main>
  );
}