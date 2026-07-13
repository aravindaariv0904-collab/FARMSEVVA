# Frequently Asked Questions

### 1. Does the app support localized regional languages?
Yes! The frontend is fully localized into English, Hindi, and Tamil. The Terra AI assistant automatically reads the user's localized language preference and outputs recommendations in that target language.

### 2. Can I run the server without a Postgres DB setup?
By default, Prisma reads database configurations from `.env`. For local testing, you can change the provider in `prisma/schema.prisma` to `sqlite` and use `file:./dev.db` to run the database completely local without docker/postgres.

### 3. What if I do not have AI API keys?
The backend service will automatically log a warning and fallback to localized context-aware static answers. This allows recruiters and developers to test the onboarding flows and see telemetry feedback without incurring active API costs.
