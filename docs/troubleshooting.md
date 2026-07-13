# Troubleshooting Guide

Common issues and resolutions for the Farm Seeva system.

---

## 1. Database Operations

### Issue: Prisma fails to run migrations
- **Symptom**: Build logs show connection timeouts or prisma schema mismatch errors.
- **Resolution**:
  1. Verify the `DATABASE_URL` matches your active PostgreSQL connection.
  2. If running local tests, make sure to execute:
     ```bash
     npx prisma generate
     npx prisma db push
     ```
  3. Confirm that database ports are open and not blocked by local firewalls.

---

## 2. API Gateway Routing

### Issue: Gateway proxy crashes
- **Symptom**: Requests to `/api/` fail with 502 bad gateway error.
- **Resolution**:
  - The project uses `gateway.js` as a unified entrypoint.
  - Verify that the backend REST service is active and running on `http://localhost:5000` so that proxy requests can route successfully.
