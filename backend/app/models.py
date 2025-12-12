from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
  __tablename__ = 'users'
  id = Column(Integer, primary_key=True, index=True)
  email = Column(String, unique=True, index=True, nullable=False)
  hashed_password = Column(String, nullable=False)
  full_name = Column(String, nullable=True)

  notes = relationship('Note', back_populates='owner', foreign_keys='Note.owner_id')


class Note(Base):
  __tablename__ = 'notes'
  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, index=True)
  content = Column(Text)
  owner_id = Column(Integer, ForeignKey('users.id'))
  created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


  owner = relationship('User', back_populates='notes')