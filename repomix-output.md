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
CODE-LOG.md
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
    "fired": {"buy": False, "sell": False},   # survives restarts
}

def load_state() -> dict:
    if not DATA_FILE.exists():
        save_state(DEFAULT_STATE)
    state = json.loads(DATA_FILE.read_text())
    # older data.json files have no "fired" key yet
    state.setdefault("fired", {"buy": False, "sell": False})
    return state

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
    state["fired"] = {"buy": False, "sell": False}
    save_state(state)
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
  title: "Yuna",
  description: "Crpyto trading bot with OKX API",
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

export async function getFilledOrders(instId: string) {
  const res = await fetch(`${BASE_URL}/api/orders/filled?inst_id=${instId}`);
  return res.json();
}

export async function getTradeHistory() {
  const res = await fetch(`${BASE_URL}/api/trades/history`);
  return res.json();
}
````

## File: CODE-LOG.md
````markdown
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
````

## File: backend/main.py
````python
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from okx_client import OKXClient
from store import load_state, update_settings, set_bot_status, reset_fired
from bot_loop import bot_loop

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
    reset_fired()
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

@app.get("/api/orders/filled")
def filled_orders(inst_id: str = "BTC-USDT"):
    # real executions reported by OKX (recent fills), not the bot's local log
    return client.get_fills(inst_id)

@app.get("/api/trades/history")
def trade_history():
    return load_state()["trade_history"]
````

## File: .gitignore
````
.env
venv/
__pycache__/
repomix-output.md
````

## File: backend/data.json
````json
{
  "settings": {
    "inst_id": "BTC-USDT",
    "buy_trigger": 85350.0,
    "sell_trigger": 85400.0,
    "order_size": "50"
  },
  "bot_status": "paused",
  "trade_history": [
    {
      "timestamp": 1791136425.3949761,
      "side": "sell",
      "price": 85420.4,
      "size": "1.00035 BTC",
      "status_msg": "FULFILLED ON 2026-10-04 19:53:45"
    },
    {
      "timestamp": 1791136436.313782,
      "side": "buy",
      "price": 85350.0,
      "size": "50 USDT (0.000586 BTC)",
      "status_msg": "FULFILLED ON 2026-10-04 19:53:56"
    },
    {
      "timestamp": 1791137517.3660867,
      "side": "sell",
      "price": 85400.0,
      "size": "1.000935 BTC",
      "status_msg": "FULFILLED ON 2026-10-04 20:11:57"
    },
    {
      "timestamp": 1791137570.2786427,
      "side": "buy",
      "price": 85350.0,
      "size": "50 USDT (0.000586 BTC)",
      "status_msg": "FULFILLED ON 2026-10-04 20:12:50"
    }
  ]
}
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
        
        body_str = "" if body is None else json.dumps(body, separators=(',', ':'))
        headers = self._headers(method, path, body_str)
        # print(f"[DEBUG] headers: {headers}")
        print("[DEBUG] API call to OKX")
        url = self.base_url + path

        # FIX: Force HTTPX to utilize IPv4 loopbacks only
        transport = httpx.HTTPTransport(local_address="0.0.0.0")

        with httpx.Client(transport=transport, timeout=10) as client:
            if method == "GET":
                resp = client.get(url, headers=headers)
            else:
                 resp = client.post(url, headers=headers, content=body_str)

        if resp.status_code != 200:
            print(f"[OKX ERROR] {resp.status_code}: {resp.text}")
        resp.raise_for_status()
        return resp.json()


    def get_ticker(self, inst_id: str) -> float:
        path = f"/api/v5/market/ticker?instId={inst_id}"
        data = self._request("GET", path)
        
        # Robust parsing protection: 
        # OKX v5 returns a dictionary containing a "data" key with an array inside.
        if isinstance(data, dict) and "data" in data and len(data["data"]) > 0:
            return float(data["data"][0]["last"])
        
        # Fallback case if the payload structure varies internally
        raise ValueError(f"Unexpected ticker payload configuration format: {data}")


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
        # fills-history covers ~3 months (plain /fills only the last 3 days); instType is required, max 100 rows
        path = f"/api/v5/trade/fills-history?instType=SPOT&instId={inst_id}&limit=100"
        return self._request("GET", path)["data"]
````

## File: frontend/app/page.tsx
````typescript
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
````

## File: README.md
````markdown
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
````

## File: backend/bot_loop.py
````python
import asyncio
import time
from okx_client import OKXClient
from store import load_state, set_bot_status, append_trade, mark_fired

POLL_INTERVAL_SECONDS = 10
client = OKXClient()

# "fired" flags (so we don't spam orders) live in data.json via store.py, so they survive restarts

async def bot_loop():
    while True:
        state = load_state()
        if state["bot_status"] != "active":
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            continue

        settings = state["settings"]
        fired = state["fired"]
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


        if buy_trigger and price <= buy_trigger and not fired["buy"]:
            try:
                btc_qty = round(float(order_size) / buy_trigger, 6)
                client.place_limit_order(inst_id, "buy", buy_trigger, str(btc_qty))
                mark_fired("buy")  # persist right after the order goes out
                
                # Create a formatted human-readable date & time string
                fulfilled_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                
                # Append to trade history array (this feeds your UI log terminal)
                append_trade({
                    "timestamp": time.time(), 
                    "side": "buy",
                    "price": buy_trigger, 
                    "size": f"{order_size} USDT ({btc_qty} BTC)",
                    "status_msg": f"FULFILLED ON {fulfilled_time}" # <-- Explicit fulfillment clock
                })
                
                print(f"[bot_loop] BUY order placed @ {buy_trigger}")
            except Exception as e:
                print(f"[bot_loop] buy order failed: {e}")


        if sell_trigger and price >= sell_trigger and not fired["sell"]:
            try:
                # 1. Fetch your exact, live available BTC balance directly from the exchange
                balances = client.get_balance()
                available_btc = balances.get("BTC", 0.0)

                if available_btc < 0.0001:
                    print(f"[bot_loop] Sell skipped: Insufficient BTC balance ({available_btc})")
                    await asyncio.sleep(POLL_INTERVAL_SECONDS)  # don't hammer OKX while waiting for BTC
                    continue

                # 2. Sell your [ENTIRE] available BTC cache instead of back-calculating a fractional size
                sell_size = str(round(available_btc, 6))
                
                # Place the limit sell order at the current market price rather than the trigger line
                client.place_limit_order(inst_id, "sell", price, sell_size)
                mark_fired("sell")  # persist right after the order goes out
                
                # Update your tracking logs with the true executed asset values
                fulfilled_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                append_trade({
                    "timestamp": time.time(), 
                    "side": "sell",
                    "price": price, 
                    "size": f"{sell_size} BTC",
                    "status_msg": f"FULFILLED ON {fulfilled_time}"
                })
                
                print(f"[bot_loop] SELL order successfully executed for {sell_size} BTC")
            except Exception as e:
                print(f"[bot_loop] sell order failed at network layer: {e}")


 



        await asyncio.sleep(POLL_INTERVAL_SECONDS)
````
