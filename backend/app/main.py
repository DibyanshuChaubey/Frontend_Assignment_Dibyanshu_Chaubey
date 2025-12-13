from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import database
from . import models, schemas, auth
from .deps import get_db, get_current_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Create database tables (for this project)
models.Base.metadata.create_all(bind=database.engine)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://mynoteapp-nine.vercel.app",
        "https://frontend-assignment-dibyanshu-chaubey.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/auth/register', response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    hashed = auth.get_password_hash(user.password)
    new = models.User(email=user.email, hashed_password=hashed, full_name=user.full_name)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@app.post('/auth/login', response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail='Incorrect credentials')
    token = auth.create_access_token({'sub': str(user.id)})
    return {'access_token': token, 'token_type': 'bearer'}

@app.get('/users/me', response_model=schemas.UserOut)
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post('/notes', response_model=schemas.NoteOut)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new = models.Note(title=note.title, content=note.content, owner_id=current_user.id)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@app.get('/notes')
def list_notes(q: str | None = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Note).filter(models.Note.owner_id == current_user.id)
    if q:
        query = query.filter(models.Note.title.ilike(f'%{q}%'))
    return query.all()

@app.get('/notes/{note_id}', response_model=schemas.NoteOut)
def get_note(note_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    n = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == current_user.id).first()
    if not n:
        raise HTTPException(status_code=404, detail='Note not found')
    return n

@app.put('/notes/{note_id}', response_model=schemas.NoteOut)
def update_note(note_id: int, note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    n = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == current_user.id).first()
    if not n:
        raise HTTPException(status_code=404, detail='Note not found')
    n.title = note.title
    n.content = note.content
    db.commit()
    db.refresh(n)
    return n

@app.delete('/notes/{note_id}')
def delete_note(note_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    n = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == current_user.id).first()
    if not n:
        raise HTTPException(status_code=404, detail='Note not found')
    db.delete(n)
    db.commit()
    return {'ok': True}
