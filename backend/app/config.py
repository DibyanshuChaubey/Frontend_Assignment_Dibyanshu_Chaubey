"""
Simple config loader that doesn't depend on pydantic-settings.
It reads values from environment variables and `.env` (via python-dotenv).
This keeps configuration simple for local development and avoids an extra dependency.
"""
from types import SimpleNamespace
import os
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "supersecret_change_this")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

settings = SimpleNamespace(
    JWT_SECRET=JWT_SECRET,
    ACCESS_TOKEN_EXPIRE_MINUTES=ACCESS_TOKEN_EXPIRE_MINUTES,
    DATABASE_URL=DATABASE_URL,
)

