# Deployment Guide

This document describes how to deploy the fullstack Farm Seeva monorepo.

## Recommended Platforms
- **Frontend App**: Netlify
- **Backend API Gateway**: Render or Railway
- **Database**: Supabase PostgreSQL or ElephantSQL

---

## 1. Database (PostgreSQL Setup)
Prisma is configured to read your database connection string via `DATABASE_URL`.
1. Sign up for a free PostgreSQL database instance (e.g. at [supabase.com](https://supabase.com/)).
2. Under project settings, copy the URI connection string.
3. Configure this variable in your backend environment settings.

---

## 2. Deploying Monorepo Backend
Set the root path of the service in Render/Railway to the `backend/` directory:
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `DATABASE_URL`: Connection string to PostgreSQL database.
  - `JWT_SECRET`: Secure JSON Web Token string.
  - `GEMINI_API_KEY`: API key for Google Gemini (primary LLM).
  - `CLAUDE_API_KEY`: (Optional) API key for Anthropic Claude (fallback LLM).

---

## 3. Deploying Monorepo Frontend
Set the build path in Netlify/Vercel to the `frontend/` directory:
- **Build Command**: `npm run build --if-present` (or leave empty if static files are served directly)
- **Publish Directory**: `.` (or `dist` if compiled)
- **Environment Variables**:
  - `VITE_API_URL`: Directs API endpoints to the deployed Express backend gateway.
