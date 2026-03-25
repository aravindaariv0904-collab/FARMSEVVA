# 🌾 Farm Seeva

> AI-powered agriculture platform helping farmers make smarter crop decisions.

Farm Seeva is a full-stack, production-ready mobile application that combines a **React Native** frontend, a **Node.js** backend, and a **Python AI engine** (powered by Claude AI) to deliver intelligent crop recommendations based on soil data.

---

## 🏗️ Architecture

```
farm-seeva/
├── mobile/          # React Native (Expo) — farmer-facing app
├── backend/         # Node.js + Express + Prisma — REST API
├── ai-engine/       # Python + FastAPI + Claude AI — crop intelligence
├── infra/           # Infrastructure config (Docker, etc.)
└── gateway.js       # API gateway / reverse proxy
```

## ✨ Features

- 🌱 **Farmer Onboarding** — language selection, profile creation
- 🧪 **Soil Data Input** — pH, NPK (Nitrogen, Phosphorus, Potassium)
- 🤖 **AI Crop Recommendations** — powered by Claude (Anthropic)
- 🔐 **Firebase Authentication** — secure, token-based auth
- 📱 **Cross-platform** — iOS & Android via Expo

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.13+
- PostgreSQL (or configure Prisma for another DB)
- Firebase project (for auth)
- Anthropic API key (for Claude AI)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/farm-seeva.git
cd farm-seeva
```

### 2. Backend
```bash
cd backend
npm install
cp ../.env.example .env   # fill in your values
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. AI Engine
```bash
cd ai-engine
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # macOS/Linux
pip install -r requirements.txt
cp ../.env.example .env
uvicorn main:app --reload
```

### 4. Mobile
```bash
cd mobile
npm install
npx expo start
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native, Expo, TypeScript |
| Backend | Node.js, Express, Prisma ORM, TypeScript |
| AI Engine | Python, FastAPI, Anthropic Claude |
| Auth | Firebase Admin SDK |
| Database | PostgreSQL (via Prisma) |

---

## 📄 License

MIT
