# DevConnect AI

Developer portfolio and hiring ecosystem — MERN stack project for college final-year submission.

Features:
- Student & Employer roles
- JWT authentication
- Student portfolio, resume upload & analysis (placeholder AI)
- Job postings, applications
- Real-time chat (Socket.io)
- GitHub integration, notifications

Folders:
- `client/` — React + Vite frontend
- `server/` — Node.js + Express backend

Quick start

1. Install dependencies

```bash
cd server
npm install
cd ../client
npm install
```

2. Create environment file for the server (`server/.env`) based on `server/.env.example`.

3. Run the server (default port 5000)

```bash
cd server
npm run dev
```

4. Run the client (Vite)

```bash
cd client
npm run dev
```

Notes
- The backend exposes routes under `/api` and the Vite dev server proxies `/api` to `http://localhost:5000`.
- AI features are implemented as modular functions in `server/src/services/aiService.js` and call an external `AI_SERVICE_URL` if provided. You can replace these with a Python FastAPI later.
- To seed sample data run `node src/seed.js` in the server (ensure `MONGO_URI` is set).

Environment variables (server/.env):

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — server port (default 5000)
- `CLIENT_URL` — allowed client origin (default http://localhost:5173)
- `CLOUDINARY_*` — optional Cloudinary credentials for image uploads
- `AI_SERVICE_URL` — optional external AI service base URL

Project status
- Core backend models, routes and controllers are implemented.
- Frontend pages and layouts are scaffolded; some employer views are placeholders.
- Remaining tasks: polish UI, add employer CRUD pages, advanced AI integration, test coverage, production-ready deployment.

If you want, I can continue implementing the remaining features step-by-step and run through local testing. Tell me which area to prioritize next or I'll continue with the Student dashboard polishing.
