# LinkPilot

A modern, enterprise-grade LinkedIn assistant web application.

## Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, React
- **Backend:** FastAPI (Python 3.10+)
- **Database:** MongoDB
- **AI:** Hugging Face API
- **UI/UX:** LinkedIn-inspired, modern industrial design

---

## Features
- OAuth login (Google, GitHub)
- LinkedIn-style chat, contact management, and message generation
- Profile and settings management
- Industrial-grade UI/UX, responsive and accessible

---

## 1. Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- [Vercel](https://vercel.com/) account (for frontend)
- [Render](https://render.com/) account (for backend)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or your own MongoDB instance
- Hugging Face API key
- Google/GitHub OAuth credentials

---

## 2. Environment Variables

### Frontend (`.env.local` for Vercel)
```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_connection_string
HUGGINGFACE_API_KEY=your_huggingface_api_key
BACKEND_API_URL=https://your-backend-on-render.com
```

### Backend (`.env` for Render or local)
```
MONGODB_URI=your_mongodb_connection_string
HUGGINGFACE_API_KEY=your_huggingface_api_key
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

---

## 3. Local Development

### Frontend
```bash
cd /path/to/LinkPilot
npm install
npm run dev
```

### Backend
```bash
cd /path/to/LinkPilot/linkedin-scraper-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 4. Deployment

### 4.1 Frontend (Vercel)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import your GitHub repo.
3. Set environment variables in Vercel dashboard (`.env.local` values above).
4. Deploy. Vercel will build and host your Next.js app.
5. After deployment, update your backend's `FRONTEND_URL` to your Vercel domain.

### 4.2 Backend (Render)
1. Push `/linkedin-scraper-api` to a separate GitHub repo (or use monorepo, but set root to this folder).
2. Go to [Render](https://render.com/), create a new **Web Service**.
3. Connect your repo, set build command:
   ```bash
   pip install -r requirements.txt
   ```
   and start command:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 10000
   ```
   (or your preferred port)
4. Set environment variables in Render dashboard (`.env` values above).
5. Deploy. Render will build and host your FastAPI backend.
6. After deployment, update your frontend's `BACKEND_API_URL` to your Render backend URL.

---

## 5. Production Checklist
- [ ] All environment variables set correctly
- [ ] MongoDB Atlas IP whitelist includes both Vercel and Render
- [ ] OAuth credentials match deployed domains
- [ ] Hugging Face API key is valid
- [ ] CORS settings allow frontend-backend communication
- [ ] Test login, chat, and all major flows in production

---

## 6. Useful Scripts
- `npm run dev` — Start Next.js frontend locally
- `npm run build && npm start` — Production build locally
- `uvicorn main:app --reload` — Start FastAPI backend locally

---

## 7. Troubleshooting
- **Auth issues:** Check OAuth callback URLs and secrets
- **API errors:** Check backend logs in Render dashboard
- **CORS errors:** Ensure both frontend and backend allow each other's domains
- **MongoDB errors:** Check connection string, IP whitelist, and user permissions

---

## 8. Contact & Support
- For issues, open a GitHub issue or contact the maintainer.
- For deployment help, see [Vercel Docs](https://vercel.com/docs) and [Render Docs](https://render.com/docs).

---

**Enjoy using LinkPilot!** 