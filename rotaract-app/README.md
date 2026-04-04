# Rotaract Team Management App

A lightweight full-stack app to manage Rotaractor profiles, board-wise team display, and admin-controlled create/edit/delete operations.

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript (`rotaract-app/frontend`)
- Backend: Node.js + Express (`rotaract-app/backend/server.js`)
- Database: PostgreSQL via `pg` (with in-memory fallback if DB is unavailable)
- Auth model: password-guarded admin actions using `x-admin-password`
- Deploy targets:
  - Frontend: Vercel (`rotaract-app/frontend/vercel.json`)
  - Backend: Render (`rotaract-app/backend/render.yaml`)

## Project Structure

```text
rotaract-app/
  backend/
	server.js
	db.js
	sql/setup.sql
	render.yaml
  frontend/
	index.html
	admin.html
	script.js
	style.css
	vercel.json
```

## Environment Variables (Backend)

Set these in your backend environment:

- `ADMIN_PASSWORD` (required, do not keep default in production)
- `DATABASE_URL` (recommended for hosted Postgres)
- `CORS_ORIGIN` (your frontend URL, for example `https://your-app.vercel.app`)

Optional local DB values (if not using `DATABASE_URL`):

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## Run Locally

1. Install backend dependencies.
2. Configure env vars.
3. Start backend.
4. Open frontend pages in browser.

```powershell
Set-Location "C:\Users\Adity\TechOpsBuildWeek\rotaract-app\backend"
npm install
npm run dev
```

Then open:

- Team page: `rotaract-app/frontend/index.html`
- Admin page: `rotaract-app/frontend/admin.html`

Note: frontend code calls `http://localhost:3000` on localhost.

## How to Access the Admin Page

The Admin link is intentionally hidden from normal website navigation.

1. Open the page directly:
   - Local: `/admin.html`
   - Deployed: `https://<your-domain>/admin.html`
2. Enter the admin password in the access prompt.
3. After entering the page, unlock admin controls in the panel using the same password.

Current behavior:

- `/admin` rewrite is disabled; only `/admin.html` is used.
- If prompt password is wrong (or cancelled), user is redirected to `index.html`.
- Access is kept in `sessionStorage` for the current browser session.

## API Overview

- `GET /health`
- `POST /admin/verify`
- `GET /members`
- `GET /members/search`
- `POST /members` (admin)
- `PUT /members/:id` (admin)
- `DELETE /members/:id` (admin)

## Deployment Notes

- Update `rotaract-app/frontend/vercel.json` API destination to your actual backend URL.
- On Render, point root to `rotaract-app/backend` and use `render.yaml`.
- Ensure `ADMIN_PASSWORD` and `DATABASE_URL` are configured before production rollout.

