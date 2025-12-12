from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
  email: EmailStr
  password: str
  full_name: Optional[str]


class UserLogin(BaseModel):
  email: EmailStr
  password: str


class UserOut(BaseModel):
  id: int
  email: EmailStr
  full_name: Optional[str]
  model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
  access_token: str
  token_type: str


class NoteCreate(BaseModel):
  title: str
  content: str


class NoteOut(BaseModel):
  id: int
  title: str
  content: str
  owner_id: int
  model_config = ConfigDict(from_attributes=True)