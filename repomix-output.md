This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
backend/
  .env_example
  bot_loop.py
  config.py
  data.json
  main.py
  okx_client.py
  requirements.txt
  store.py
  test_okx.py
frontend/
  app/
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  lib/
    api.ts
  public/
    file.svg
    globe.svg
    next.svg
    vercel.svg
    window.svg
  .gitignore
  AGENTS.md
  CLAUDE.md
  eslint.config.mjs
  next.config.ts
  package.json
  postcss.config.mjs
  README.md
  tsconfig.json
.gitignore
README.md
````

# Files

## File: backend/.env_example
````
OKX_API_KEY=your_key_here
OKX_API_SECRET=your_secret_here
OKX_API_PASSPHRASE=your_passphrase_here
OKX_BASE_URL=https://my.okx.com
OKX_SIMULATED=1
````

## File: backend/config.py
````python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    okx_api_key: str
    okx_api_secret: str
    okx_api_passphrase: str
    okx_base_url: str = "https://www.okx.com"
    okx_simulated: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
````

## File: backend/okx_client.py
````python
import base64
import hmac
import hashlib
import time
import httpx
from config import settings
# print(settings.okx_api_key)

class OKXClient:
    def __init__(self):
        self.base_url = settings.okx_base_url
        self.api_key = settings.okx_api_key
        self.secret = settings.okx_api_secret
        self.passphrase = settings.okx_api_passphrase
        self.simulated = settings.okx_simulated

    def _timestamp(self) -> str:
        return time.strftime("%Y-%m-%dT%H:%M:%S.", time.gmtime()) + \
            f"{int(time.time() * 1000) % 1000:03d}Z"

    def _sign(self, timestamp: str, method: str, path: str, body: str = "") -> str:
        message = f"{timestamp}{method}{path}{body}"
        mac = hmac.new(self.secret.encode(), message.encode(), hashlib.sha256)
        return base64.b64encode(mac.digest()).decode()

    def _headers(self, method: str, path: str, body: str = "") -> dict:
        ts = self._timestamp()
        headers = {
            "OK-ACCESS-KEY": self.api_key,
            "OK-ACCESS-SIGN": self._sign(ts, method, path, body),
            "OK-ACCESS-TIMESTAMP": ts,
            "OK-ACCESS-PASSPHRASE": self.passphrase,
            "Content-Type": "application/json",
        }
        if self.simulated:
            headers["x-simulated-trading"] = "1"
        return headers

    def _request(self, method: str, path: str, body: dict | None = None):
        import json
        body_str = "" if body is None else json.dumps(body)
        headers = self._headers(method, path, body_str)
        print(f"[DEBUG] headers: {headers}")  # <-- add this
        url = self.base_url + path

        with httpx.Client(timeout=10) as client:
            if method == "GET":
                resp = client.get(url, headers=headers)
            else:
                resp = client.post(url, headers=headers, content=body_str)

        if resp.status_code != 200:
            print(f"[OKX ERROR] {resp.status_code}: {resp.text}")  # <-- add this
        resp.raise_for_status()
        return resp.json()

    def get_ticker(self, inst_id: str) -> float:
        path = f"/api/v5/market/ticker?instId={inst_id}"
        data = self._request("GET", path)
        return float(data["data"][0]["last"])

    def get_balance(self) -> dict:
        path = "/api/v5/account/balance"
        data = self._request("GET", path)
        details = data["data"][0]["details"]
        return {d["ccy"]: float(d["availBal"]) for d in details}

    def place_limit_order(self, inst_id: str, side: str, price: float, size: str) -> dict:
        path = "/api/v5/trade/order"
        body = {
            "instId": inst_id,
            "tdMode": "cash",
            "side": side,          # "buy" or "sell"
            "ordType": "limit",
            "px": str(price),
            "sz": size,
        }
        return self._request("POST", path, body)

    def get_pending_orders(self, inst_id: str) -> list:
        path = f"/api/v5/trade/orders-pending?instId={inst_id}"
        return self._request("GET", path)["data"]

    def get_fills(self, inst_id: str) -> list:
        path = f"/api/v5/trade/fills?instId={inst_id}"
        return self._request("GET", path)["data"]
````

## File: backend/requirements.txt
````
annotated-doc==0.0.5
annotated-types==0.8.0
anyio==4.15.1
certifi==2026.7.22
click==8.5.0
fastapi==0.141.1
h11==0.16.0
httpcore==1.0.9
httptools==0.8.0
httpx==0.28.1
idna==3.20
pydantic==2.13.5
pydantic-settings==2.15.0
pydantic_core==2.46.5
python-dotenv==1.2.3
PyYAML==6.0.3
starlette==1.7.0
typing-inspection==0.4.4
typing_extensions==4.16.0
uvicorn==0.54.0
watchfiles==1.3.0
websockets==17.1
````

## File: backend/store.py
````python
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
````

## File: frontend/app/globals.css
````css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
````

## File: frontend/app/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
````

## File: frontend/app/page.tsx
````typescript
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
````

## File: frontend/lib/api.ts
````typescript
const BASE_URL = "http://localhost:8000";

export async function getStatus() {
  const res = await fetch(`${BASE_URL}/api/status`);
  return res.json();
}

export async function postSettings(settings: {
  inst_id: string;
  buy_trigger?: number;
  sell_trigger?: number;
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

export async function getTradeHistory() {
  const res = await fetch(`${BASE_URL}/api/trades/history`);
  return res.json();
}
````

## File: frontend/public/file.svg
````xml
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: frontend/public/globe.svg
````xml
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: frontend/public/next.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: frontend/public/vercel.svg
````xml
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: frontend/public/window.svg
````xml
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: frontend/.gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
````

## File: frontend/AGENTS.md
````markdown
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
````

## File: frontend/CLAUDE.md
````markdown
@AGENTS.md
````

## File: frontend/eslint.config.mjs
````javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
````

## File: frontend/next.config.ts
````typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
````

## File: frontend/package.json
````json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.3.6",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
````

## File: frontend/postcss.config.mjs
````javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
````

## File: frontend/README.md
````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````

## File: frontend/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
````

## File: .gitignore
````
.env
venv/
__pycache__/
````

## File: README.md
````markdown
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
2. Run the Python backend: `uvicorn backend.main:app --reload`
3. Run the Next.js frontend: `npm run dev`
4. Open the dashboard, set your buy/sell triggers and order size, hit Start.



## Roadmap (post-MVP)

- Notifications on fills (Telegram/email)
- Multi-pair support
- Dockerized deployment for always-on running
- More order types (OCO, trailing)
````

## File: backend/bot_loop.py
````python
import asyncio
import time
from okx_client import OKXClient
from store import load_state, set_bot_status, append_trade

POLL_INTERVAL_SECONDS = 10
client = OKXClient()

# tracks whether each trigger has already fired, so we don't spam orders
_fired = {"buy": False, "sell": False}

async def bot_loop():
    while True:
        state = load_state()
        if state["bot_status"] != "active":
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            continue

        settings = state["settings"]
        inst_id = settings["inst_id"]
        buy_trigger = settings.get("buy_trigger")
        sell_trigger = settings.get("sell_trigger")
        order_size = settings.get("order_size")

        try:
            price = client.get_ticker(inst_id)
            print(f"[bot_loop] checked {inst_id} @ {price} (buy_trigger={buy_trigger}, sell_trigger={sell_trigger})")
        except Exception as e:
            print(f"[bot_loop] price fetch failed: {e}")
            set_bot_status("error")
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            continue

        if buy_trigger and price <= buy_trigger and not _fired["buy"]:
            try:
                # order_size is entered by the user in USDT, but OKX spot limit
                # orders require size in base currency (BTC) — convert here.
                btc_qty = round(float(order_size) / buy_trigger, 6)
                client.place_limit_order(inst_id, "buy", buy_trigger, str(btc_qty))
                append_trade({
                    "timestamp": time.time(), "side": "buy",
                    "price": buy_trigger, "size": order_size,
                })
                _fired["buy"] = True
                print(f"[bot_loop] BUY order placed @ {buy_trigger}")
            except Exception as e:
                print(f"[bot_loop] buy order failed: {e}")

        if sell_trigger and price >= sell_trigger and not _fired["sell"]:
            try:
                client.place_limit_order(inst_id, "sell", sell_trigger, order_size)
                append_trade({
                    "timestamp": time.time(), "side": "sell",
                    "price": sell_trigger, "size": order_size,
                })
                _fired["sell"] = True
                print(f"[bot_loop] SELL order placed @ {sell_trigger}")
            except Exception as e:
                print(f"[bot_loop] sell order failed: {e}")

        await asyncio.sleep(POLL_INTERVAL_SECONDS)
````

## File: backend/data.json
````json
{
  "settings": {
    "inst_id": "BTC-USDT",
    "buy_trigger": 84640.0,
    "sell_trigger": 999999.0,
    "order_size": "10"
  },
  "bot_status": "active",
  "trade_history": []
}
````

## File: backend/main.py
````python
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from okx_client import OKXClient
from store import load_state, update_settings, set_bot_status
from bot_loop import bot_loop, _fired

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(bot_loop())
    print("[main] bot_loop task started")  # confirm this line prints on startup
    yield
    task.cancel()

app = FastAPI(lifespan=lifespan)
client = OKXClient()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# remove the old @app.on_event("startup") block entirely:
# @app.on_event("startup")
# async def startup():
#     asyncio.create_task(bot_loop())

class SettingsIn(BaseModel):
    inst_id: str
    buy_trigger: float | None = None
    sell_trigger: float | None = None
    order_size: str | None = None

@app.get("/api/status")
def get_status():
    state = load_state()
    return {
        "bot_status": state["bot_status"],
        "settings": state["settings"],
    }

@app.post("/api/settings")
def post_settings(payload: SettingsIn):
    updated = update_settings(payload.dict(exclude_none=True))
    _fired["buy"] = False
    _fired["sell"] = False
    return updated

@app.post("/api/bot/start")
def start_bot():
    set_bot_status("active")
    return {"bot_status": "active"}

@app.post("/api/bot/pause")
def pause_bot():
    set_bot_status("paused")
    return {"bot_status": "paused"}

@app.get("/api/market/price")
def market_price(inst_id: str = "BTC-USDT"):
    return {"price": client.get_ticker(inst_id)}

@app.get("/api/balances")
def balances():
    return client.get_balance()

@app.get("/api/orders/pending")
def pending_orders(inst_id: str = "BTC-USDT"):
    return client.get_pending_orders(inst_id)

@app.get("/api/trades/history")
def trade_history():
    return load_state()["trade_history"]
````

## File: backend/test_okx.py
````python
# # backend/test_okx.py - delete once confirmed working
# from okx_client import OKXClient

# client = OKXClient()
# print(client.get_ticker("BTC-USDT"))
# print(client.get_balance())

from config import settings
print(f"KEY: [{settings.okx_api_key}]")
# print(f"SECRET LEN: {len(settings.okx_api_secret)}")
# print(f"PASSPHRASE: [{settings.okx_api_passphrase}]")
````
