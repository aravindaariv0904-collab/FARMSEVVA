# API Reference

This document covers backend endpoints for the Farm Seeva services.

---

## 1. Authentication Routes (`/api/auth`)

### Register Farmer
* **Endpoint**: `/api/auth/register`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Body**:
  ```json
  {
    "name": "Rajesh Kumar",
    "email": "rajesh@farm.com",
    "password": "securepassword123",
    "state": "Maharashtra",
    "district": "Pune"
  }
  ```
* **Response (200 Success)**: JWT Token and user data.

---

## 2. Soil & Telemetry Routes (`/api/soil`)

### Submit Soil Data (Authenticated)
* **Endpoint**: `/api/soil`
* **Method**: `POST`
* **Headers**: `Authorization: Bearer <jwt_token>`
* **Body**:
  ```json
  {
    "nitrogen": 45,
    "phosphorus": 30,
    "potassium": 65,
    "ph": 6.8
  }
  ```
* **Response (200 Success)**: Created SoilData record.

---

## 3. Terra AI Chat Routes (`/api/terra-ai`)

### Chat with Assistant (Authenticated)
* **Endpoint**: `/api/terra-ai/chat`
* **Method**: `POST`
* **Headers**: `Authorization: Bearer <jwt_token>`
* **Body**:
  ```json
  {
    "message": "Which vegetables should I grow next week?",
    "language": "hi"
  }
  ```
* **Response (200 Success)**:
  ```json
  {
    "reply": "नमस्ते राजेश! आपके मिट्टी के पीएच (6.8) और वर्तमान सीजन (Kharif) को देखते हुए, टमाटर और बैंगन की खेती शुरू करना सबसे अच्छा रहेगा...",
    "confidenceScore": 80
  }
  ```
