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