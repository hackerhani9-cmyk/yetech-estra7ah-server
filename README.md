# YeTech Estra7ah Local Media Server

A high-performance, offline-first local media server inspired by the YeTech Estra7ah architecture. It runs entirely on a LAN / Wi-Fi network and streams media from local folders without requiring an active internet connection. It includes a SQLite-backed library, local media scanning, AI-assisted metadata enrichment heuristics, and automated download monitoring.

## Features
- Express + SQLite backend
- React + Vite frontend with Arabic RTL layout
- Offline local media streaming over LAN
- Automatic library scanning of local folders
- AI-style metadata enrichment using local filename and folder heuristics
- Download watcher for auto-importing new media files
- Docker Compose + Dockerfile setup

## Project structure
```text
.
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── data/
│   ├── media/
│   ├── downloads/
│   └── src/
│       ├── server.js
│       ├── db.js
│       ├── mediaScanner.js
│       ├── downloadWatcher.js
│       └── utils.js
└── frontend/
    ├── Dockerfile
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api.js
        └── styles.css
```

## Local run (without Docker)

1. Create backend env file:
```bash
cp backend/.env.example backend/.env
```

2. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Start the backend:
```bash
cd backend && npm run dev
```

4. Start the frontend:
```bash
cd frontend && npm run dev -- --host 0.0.0.0
```

5. Open the app in the browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/health

## Docker run

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Media folders
The application watches these local folders by default:
- `backend/media`
- `backend/downloads`

Place your movies, series, or audio files in `backend/media` and any downloaded files in `backend/downloads`.

## Offline operation note
This app does not rely on external internet services for playback or metadata enrichment. All media transcoding, streaming, and description generation use local filesystem logic and browser-native video playback.

## Default architecture
- Backend: Node.js + Express
- Frontend: React + Vite
- Database: SQLite via better-sqlite3
- Playback: HTML5 video/audio player using local file streaming
- Metadata enrichment: local heuristics using file names and folder names

## Environment variables
Backend:
```env
PORT=3001
HOST=0.0.0.0
MEDIA_ROOT=/app/media
DOWNLOADS_ROOT=/app/downloads
DB_PATH=/app/data/media.db
```

Frontend:
```env
VITE_API_URL=http://localhost:3001
```

## License
For local home-server use and experimentation.
