# AI Vocabulary Learning Assistant

## Project Structure
```
vocab-voice-app/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Main pages
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Custom middleware
│   │   └── routes/         # API routes
│   ├── uploads/            # Temporary file storage
│   └── package.json
├── database/               # Database schemas
└── deployment/            # Deployment configs
```

## Features
- Image-based word extraction using OCR
- Voice-based pronunciation practice
- AI-powered pronunciation evaluation
- Progress tracking and analytics
- Dark/Light mode support
- Responsive design

## Tech Stack
- Frontend: React, Material-UI, Web Speech API
- Backend: Node.js, Express, MongoDB
- OCR: Tesseract.js
- Speech: OpenAI Whisper API
- Deployment: Render (backend), Netlify (frontend)