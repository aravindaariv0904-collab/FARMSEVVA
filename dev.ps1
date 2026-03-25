# Farm Seeva Multi-Service Dev Script (PowerShell)

Write-Host "==========================================" -ForegroundColor Green
Write-Host "🌾 Starting Farm Seeva Development Stack..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Green

# 1. Start Infrastructure (Docker)
Write-Host "🚀 Starting Database & Redis (Docker Compose)..." -ForegroundColor Yellow
docker-compose -f infra/docker-compose.yml up -d

# 2. Start Services (Concurrent)
Write-Host "🏃 Launching Gateway, Backend, AI & Mobile..." -ForegroundColor Cyan
npm run start
