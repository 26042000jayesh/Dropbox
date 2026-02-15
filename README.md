# Dropbox Clone

Minimal file upload/download app (React + Express + MySQL + S3/LocalStack).

## Requirements

- **Node.js** 18+ (backend: Express 5, frontend: React 19, Vite 7)
- **npm** (comes with Node)
- **Docker & Docker Compose** (for MySQL 8, LocalStack, or full stack)

## Run the project

### With Docker (all-in-one)

```bash
docker compose up --build -d
```

App: **http://localhost:3015**

First-time only — run DB migrations:

```bash
docker exec -i dropbox-db mysql -u root -proot dropbox_db < backend/src/migrations/001_create_tables.sql
```

### Local dev (backend + frontend separately)

1. Start DB and LocalStack:

   ```bash
   docker compose up -d db localstack
   ```

2. Run migrations (first time only):

   ```bash
   docker exec -i dropbox-db mysql -u root -proot dropbox_db < backend/src/migrations/001_create_tables.sql
   ```

3. Backend:

   ```bash
   cd backend && npm install && npm run dev
   ```
   → http://localhost:3015

4. Frontend (new terminal):

   ```bash
   cd frontend && npm install && npm run dev
   ```
   → http://localhost:5173 (proxies API to backend)
