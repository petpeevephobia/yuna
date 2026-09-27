# # backend/test_okx.py - delete once confirmed working
# from okx_client import OKXClient

# client = OKXClient()
# print(client.get_ticker("BTC-USDT"))
# print(client.get_balance())

from config import settings
print(f"KEY: [{settings.okx_api_key}]")
# print(f"SECRET LEN: {len(settings.okx_api_secret)}")
# print(f"PASSPHRASE: [{settings.okx_api_passphrase}]")