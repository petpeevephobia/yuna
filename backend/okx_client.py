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