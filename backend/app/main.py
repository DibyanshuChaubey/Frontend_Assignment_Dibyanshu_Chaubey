from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import database
from . import models, schemas, auth
from .deps import get_db, get_current_user
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Create database tables. In production, we'd use Alembic migrations,
# but for this project, this ensures the schema exists when the app starts.
models.Base.metadata.create_all(bind=database.engine)


# CORS setup - allow our Next.js frontend (port 3000) to talk to this API.
# In production, we'd be more restrictive about allowed origins.
app.add_middleware(
CORSMiddleware,
allow_origins=['http://localhost:3000'],
allow_credentials=True,
allow_methods=['*'],
allow_headers=['*'],
)


@app.post('/auth/register', response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
  # Check if the email is already in use. Prevent duplicate accounts.
  db_user = db.query(models.User).filter(models.User.email == user.email).first()
  if db_user:
   raise HTTPException(status_code=400, detail='Email already registered')
  # Hash the password before storing. Never store passwords in plain text—that's the cardinal sin of auth.
  hashed = auth.get_password_hash(user.password)
  # Create the user record with the hashed password.
  new = models.User(email=user.email, hashed_password=hashed, full_name=user.full_name)
  db.add(new)
  db.commit()
  db.refresh(new)  # Refresh to get the auto-generated ID.
  return new


@app.post('/auth/login', response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
  # Look up the user by email.
  user = db.query(models.User).filter(models.User.email == form_data.email).first()
  # Verify both that the user exists and that the password is correct.
  # We use "not user or not verify" so we don't leak whether the email exists.
  if not user or not auth.verify_password(form_data.password, user.hashed_password):
   raise HTTPException(status_code=401, detail='Incorrect credentials')
  # Create a JWT token that the frontend will use to identify this user.
  # The token expires in 60 minutes by default (see auth.py).
  token = auth.create_access_token({'sub': str(user.id)})
  return {'access_token': token, 'token_type': 'bearer'}


@app.get('/users/me', response_model=schemas.UserOut)
def read_me(current_user: models.User = Depends(get_current_user)):
  return current_user


# CRUD for notes
@app.post('/notes', response_model=schemas.NoteOut)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
  new = models.Note(title=note.title, content=note.content, owner_id=current_user.id)
  db.add(new)
  db.commit()
  db.refresh(new)
  return new


@app.get('/notes')
def list_notes(q: str | None = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
  # Query notes owned by the current user
  # Note: Sorting by updated_at will be added after migration of existing databases
  query = db.query(models.Note).filter(models.Note.owner_id == current_user.id)
  if q:
   query = query.filter(models.Note.title.ilike(f'%{q}%'))
  return query.all()


@app.get('/notes/{note_id}', response_model=schemas.NoteOut)
def get_note(note_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
  n = db.query(models.Note).filter(models.Note.id==note_id, models.Note.owner_id==current_user.id).first()
  if not n:
   raise HTTPException(status_code=404, detail='Note not found')
  return n


@app.put('/notes/{note_id}', response_model=schemas.NoteOut)
def update_note(note_id: int, note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
  n = db.query(models.Note).filter(models.Note.id==note_id, models.Note.owner_id==current_user.id).first()
  if not n:
   raise HTTPException(status_code=404, detail='Note not found')
  n.title = note.title
  n.content = note.content
  db.commit()
  db.refresh(n)
  return n


@app.delete('/notes/{note_id}')
def delete_note(note_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
  n = db.query(models.Note).filter(models.Note.id==note_id, models.Note.owner_id==current_user.id).first()
  if not n:
   raise HTTPException(status_code=404, detail='Note not found')
  db.delete(n)
  db.commit()
  return {'ok': True}