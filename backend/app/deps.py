from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import auth, models


# OAuth2PasswordBearer tells FastAPI where to look for the token.
# It'll check the Authorization header for "Bearer <token>".
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/login')


def get_db():
  """
  Dependency that provides a database session.
  FastAPI calls this automatically when a route needs it.
  The try/finally ensures we close the connection even if something goes wrong.
  """
  db = SessionLocal()
  try:
   yield db
  finally:
   db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
  """
  This is a dependency that extracts and validates the current user from the JWT token.
  Any endpoint that needs the logged-in user can add 'current_user: models.User = Depends(get_current_user)'
  to its parameters, and FastAPI will handle the rest.
  """
  if not token:
    raise HTTPException(status_code=401, detail='No token provided')
  # Decode the token. If it's expired or invalid, decode_access_token returns None.
  payload = auth.decode_access_token(token)
  if not payload:
   raise HTTPException(status_code=401, detail='Invalid token')
  # Extract the 'sub' field (subject), which we set to the user's ID.
  user_id = payload.get('sub')
  if not user_id:
    raise HTTPException(status_code=401, detail='Invalid token format')
  try:
    # The 'sub' field is a string (we converted it when creating the token),
    # so we need to convert it back to an integer to query the database.
    user_id = int(user_id)
  except (ValueError, TypeError):
    raise HTTPException(status_code=401, detail='Invalid user ID in token')
  user = db.query(models.User).filter(models.User.id == user_id).first()
  if not user:
   raise HTTPException(status_code=401, detail='User not found')
  return user