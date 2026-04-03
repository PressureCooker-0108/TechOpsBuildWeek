# Rotaract App Deployment Notes

This setup keeps your current features and makes deployment straightforward:

- Database: Supabase Postgres
- Backend API: Render (`rotaract-app/backend`)
- Frontend: Vercel (`rotaract-app/frontend`)

## 1) Supabase

Create a Supabase project and copy the Postgres connection string.

Set this on Render as `DATABASE_URL`.

## 2) Render (backend)

Service root should be `rotaract-app/backend`.

Required env vars:

- `DATABASE_URL` = Supabase connection string
- `ADMIN_PASSWORD` = your admin password
- `CORS_ORIGIN` = your Vercel domain (for example: `https://your-app.vercel.app`)

Render config file is included at `rotaract-app/backend/render.yaml`.

## 3) Vercel (frontend)

Project root should be `rotaract-app/frontend`.

`vercel.json` is included and rewrites `/api/*` to your Render backend.

Before deploying, update this file:

- `rotaract-app/frontend/vercel.json`
- Replace `https://YOUR-RENDER-SERVICE.onrender.com` with your real Render URL

## 4) Local development

Backend:

- Copy `rotaract-app/backend/.env.example` to `.env`
- Fill values for local Postgres or use `DATABASE_URL`
- Run backend on port 3000

Frontend:

- Open `rotaract-app/frontend/index.html` or `admin.html`
- In local mode, frontend calls `http://localhost:3000`

## 5) Quick verification

- `GET /health` should return `storage: "postgresql"` once DB is connected.
- Add/edit/delete in admin page should persist after backend restart.

