# Notes Application

A full-stack notes application built with FastAPI and Next.js, featuring user authentication, markdown support, and a modern dark mode interface.

## Features

- 🔐 User authentication with JWT tokens
- 📝 Create, read, update, and delete notes
- 🎨 Markdown support with live preview
- 🌓 Dark mode toggle
- 🔍 Search and filter notes
- 💾 Auto-save drafts
- 📱 Responsive design
- 🎭 Smooth animations with Framer Motion

## Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy
- SQLite
- JWT authentication
- Python 3.8+

**Frontend:**
- Next.js 13
- React 18
- Tailwind CSS
- Framer Motion
- React Markdown
- Zustand (state management)

## Quick Start

### Backend Setup

```bash
cd backend/app
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`  
API docs available at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /users/me` - Get current user info

### Notes
- `POST /notes` - Create new note
- `GET /notes` - Get all user notes (supports search with `?q=`)
- `GET /notes/{id}` - Get specific note
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note

## Project Structure

```
.
├── backend/
│   └── app/
│       ├── main.py           # API routes
│       ├── models.py         # Database models
│       ├── schemas.py        # Pydantic schemas
│       ├── auth.py           # Authentication logic
│       ├── database.py       # Database setup
│       └── deps.py           # Dependencies
│
├── frontend/
│   ├── pages/                # Next.js pages
│   ├── components/           # React components
│   ├── lib/                  # API client & utilities
│   ├── hooks/                # Custom React hooks
│   └── styles/               # CSS styles
│
└── POSTMAN_collection.json   # API test collection
```

## Security Features

- JWT token-based authentication
- Password hashing with SHA-256
- Protected routes and API endpoints
- User isolation (users can only access their own notes)
- Input validation on both frontend and backend
- CORS configuration

## Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./app.db
```

## Testing

Import the Postman collection to test all API endpoints, or use the interactive API docs at `http://localhost:8000/docs`

## License

MIT

