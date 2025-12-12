from datetime import datetime, timedelta
from jose import JWTError, jwt
import hashlib

# Centralized config loader - uses .env when present and environment variables otherwise
from .config import settings

# Use values from settings (Pydantic BaseSettings). Defaults are defined in config.py
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = 'HS256'  # HMAC SHA-256 is the industry standard for JWT.
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES  # Tokens are valid for configured minutes.


def verify_password(plain, hashed):
  """
  Check if a plain text password matches the hashed version.
  We use SHA256 here for simplicity, but bcrypt would be better in production.
  """
  return hashlib.sha256(plain.encode()).hexdigest() == hashed


def get_password_hash(password):
  """
  Hash a password using SHA256.
  In real-world apps, we'd add a salt and use bcrypt, but this demonstrates the principle:
  never store passwords in plain text.
  """
  return hashlib.sha256(password.encode()).hexdigest()


def create_access_token(data: dict, expires_delta: timedelta | None = None):
  """
  Create a JWT token. The 'data' dict should have 'sub' (the user ID as a string).
  This was tricky to get right—python-jose handles the datetime conversion,
  so we just pass the datetime object directly to 'exp'. Don't convert it to int yourself.
  """
  to_encode = data.copy()
  if expires_delta:
    expire = datetime.utcnow() + expires_delta
  else:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  # The 'exp' field tells the token when to expire.
  # python-jose will handle converting this datetime to a Unix timestamp.
  to_encode.update({'exp': expire})
  encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  return encoded_jwt


def decode_access_token(token: str):
  """
  Decode and verify a JWT token.
  If the token is valid (not expired, not tampered with), return the payload.
  If something's wrong, return None.
  """
  try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload
  except JWTError:
    # Token is expired, invalid signature, or malformed. Don't leak why.
    return None