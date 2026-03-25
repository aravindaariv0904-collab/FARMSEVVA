# 🌾 Farm Seeva - AI-Powered Agriculture Platform

![Farm Seeva Dashboard](https://github.com/aravindaariv0904-collab/FARMSEVVA/raw/main/assets/preview.png)

> **Empowering Farmers with Data-Driven Insights.** 
> Farm Seeva is a production-ready, modular monorepo platform that leverages AI to provide precise crop recommendations based on soil health (Nitrogen, Phosphorus, Potassium).

---

## ✨ Features

- 🧠 **AI-Driven Recommendations**: Rule-based and ML-ready engine for crop selection.
- 🧪 **Soil Analysis**: Track N, P, K levels and receive actionable insights.
- 🌐 **Multi-Language Support**: Fully localized in English, Hindi, and Tamil.
- 🛡️ **Enterprise Security**: JWT authentication, rate limiting, and input validation.
- 🎨 **Premium UI/UX**: Modern glassmorphism design with 3D animations and responsive layouts.
- 🧱 **Clean Architecture**: Domain-driven design with clear separation of concerns.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Farmer/User]) <--> Gateway[Unified Gateway :3000]
    Gateway <--> Frontend[Frontend Module\nVanilla JS / CSS]
    Gateway <--> Backend[Backend API :5000\nNode.js / Express]
    Backend <--> DB[(PostgreSQL / Prisma)]
    Backend <--> AI[AI Engine\nCrop Logic]
    
    subgraph "Core Components"
        Frontend
        Backend
        AI
    end
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) |
| **Security** | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) |

---

## 📁 Repository Structure

```text
FarmSeeva/
├── 🌐 frontend/          # Vanilla JS Modular Application
│   ├── css/              # Premium Design System (Glassmorphism)
│   ├── i18n/             # Multilingual Support (en, hi, ta)
│   ├── js/               # API, Auth, Soil & Crop Logic
│   └── dashboard.html    # Core User Interface
├── ⚙️ backend/           # Robust REST API (TypeScript)
│   ├── src/modules/      # Auth, Soil, & Crop Domains
│   ├── middleware/       # Security & Validation
│   └── prisma/           # Data Modeling
├── 🧠 ai-engine/         # (Coming Soon) Advanced AI Models
├── 📱 mobile/            # (Coming Soon) Mobile Application
├── 🔗 shared/            # Cross-module Domain Types
└── 🌉 gateway.js         # Unified Proxy Server
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker)

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Initialize Database
```bash
# Start Docker containers
npm run docker:up

# Run migrations
npm run prisma:init
```

### 4. Start the Application
```bash
npm install
npm start
```
The application will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 📈 Roadmap

- [x] Responsive Dashboard & Soil Data Input
- [x] Multilingual Support (English, Hindi, Tamil)
- [x] Robust JWT Authentication
- [ ] Integration with Python AI Engine
- [ ] Mobile App Launch (iOS/Android)
- [ ] Real-time Weather Integration

---

Built with ❤️ by **Farm Seeva Team** for the future of farming.

