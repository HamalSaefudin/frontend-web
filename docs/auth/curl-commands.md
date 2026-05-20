
# cURL Commands — Master COA Module

> **Base URL:** `http://localhost:8080`
> 
> **Authentication:** Bearer JWT Token (replace `<YOUR_JWT_TOKEN>` with actual token)
> 
> **Role Required:** ADMIN

---

## Authentication — How to Get JWT Tokenss


### Step 1: Register a User (first time only)

```bash
curl -X POST "http://localhost:8080/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "YourSecurePassword123!"
  }'
```

### Step 2: Login to Get Token

```bash
curl -X POST "http://localhost:8080/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "YourSecurePassword123!"
  }'
```

**Response will contain:**
```json
{
  "success": true,
  "code": "LOGIN_SUCCESS",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "tokenType": "Bearer"
  }
}
```

### Step 3: Use the Token

Replace `<YOUR_JWT_TOKEN>` in all Master COA cURL commands with the `accessToken` value from the login response.

### Step 4: Refresh Token (when expired)

```bash
curl -X POST "http://localhost:8080/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## Auth Endpoints Quick Reference

| # | Endpoint | Method | Description |
|---|----------|--------|-------------|
| 1 | `/api/v1/auth/register` | POST | Register new user |
| 2 | `/api/v1/auth/login` | POST | Login & get JWT token |
| 3 | `/api/v1/auth/refresh` | POST | Refresh expired token |
| 4 | `/api/v1/auth/me` | GET | Get current user profile |
| 5 | `/api/v1/auth/password` | PUT | Change password |
| 6 | `/api/v1/auth/logout` | POST | Logout |

---

## API-001 — Create Master COA

```bash
curl -X POST "http://localhost:8080/api/v1/master-coas" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "coaName": "COA Operasional",
    "branches": [
      "BDG01",
      "JKT01"
    ],
    "transactions": [
      {
        "transactionName": "Kas Masuk",
        "category": "TRX_IN",
        "subgroup": "PENERIMAAN",
        "group": "OPERASIONAL"
      }
    ]
  }'
```

---

## API-002 — Update Master COA

```bash
curl -X PUT "http://localhost:8080/api/v1/master-coas/COA01" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "coaName": "COA Operasional Updated",
    "branches": [
      "BDG01"
    ],
    "transactions": [
      {
        "transactionName": "Kas Keluar",
        "category": "TRX_OUT",
        "subgroup": "PENGELUARAN",
        "group": "OPERASIONAL"
      }
    ]
  }'
```

---

## API-003 — Activate Master COA

```bash
curl -X PATCH "http://localhost:8080/api/v1/master-coas/COA01/activate" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## API-004 — Deactivate Master COA

```bash
curl -X PATCH "http://localhost:8080/api/v1/master-coas/COA01/deactivate" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## API-005 — Copy Master COA

```bash
curl -X POST "http://localhost:8080/api/v1/master-coas/COA01/copy" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "branches": [
      "SBY01"
    ]
  }'
```

---

## API-006 — Delete Master COA

```bash
curl -X DELETE "http://localhost:8080/api/v1/master-coas/COA01" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## API-007 — Get Master COA Detail

```bash
curl -X GET "http://localhost:8080/api/v1/master-coas/COA01" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## API-008 — List Master COA

### List all (default pagination)

```bash
curl -X GET "http://localhost:8080/api/v1/master-coas" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### List with keyword search

```bash
curl -X GET "http://localhost:8080/api/v1/master-coas?keyword=Operasional" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### List filtered by status

```bash
curl -X GET "http://localhost:8080/api/v1/master-coas?status=ACTIVE" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### List with pagination

```bash
curl -X GET "http://localhost:8080/api/v1/master-coas?page=0&size=10" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### List with combined filters

```bash
curl -X GET "http://localhost:8080/api/v1/master-coas?keyword=Operasional&status=ACTIVE&page=0&size=10" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## Quick Reference Table

| # | Endpoint | Method | Description |
|---|----------|--------|-------------|
| 1 | `/api/v1/master-coas` | POST | Create Master COA |
| 2 | `/api/v1/master-coas/{coaId}` | PUT | Update Master COA |
| 3 | `/api/v1/master-coas/{coaId}/activate` | PATCH | Activate Master COA |
| 4 | `/api/v1/master-coas/{coaId}/deactivate` | PATCH | Deactivate Master COA |
| 5 | `/api/v1/master-coas/{coaId}/copy` | POST | Copy Master COA |
| 6 | `/api/v1/master-coas/{coaId}` | DELETE | Delete Master COA |
| 7 | `/api/v1/master-coas/{coaId}` | GET | Get Master COA Detail |
| 8 | `/api/v1/master-coas` | GET | List Master COA |