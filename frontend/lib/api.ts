const BASE_URL = "http://localhost:8000";

export async function getStatus() {
  const res = await fetch(`${BASE_URL}/api/status`);
  return res.json();
}

export async function postSettings(settings: {
  inst_id: string;
  buy_trigger?: number | null;
  sell_trigger?: number | null;
  stop_loss?: number | null;
  order_size?: string;
}) {
  const res = await fetch(`${BASE_URL}/api/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  return res.json();
}

export async function startBot() {
  return fetch(`${BASE_URL}/api/bot/start`, { method: "POST" }).then(r => r.json());
}

export async function pauseBot() {
  return fetch(`${BASE_URL}/api/bot/pause`, { method: "POST" }).then(r => r.json());
}

export async function getMarketPrice(instId: string) {
  const res = await fetch(`${BASE_URL}/api/market/price?inst_id=${instId}`);
  return res.json();
}

export async function getBalances() {
  const res = await fetch(`${BASE_URL}/api/balances`);
  return res.json();
}

export async function getPendingOrders(instId: string) {
  const res = await fetch(`${BASE_URL}/api/orders/pending?inst_id=${instId}`);
  return res.json();
}

export async function getFilledOrders(instId: string) {
  const res = await fetch(`${BASE_URL}/api/orders/filled?inst_id=${instId}`);
  return res.json();
}

export async function getTradeHistory() {
  const res = await fetch(`${BASE_URL}/api/trades/history`);
  return res.json();
}