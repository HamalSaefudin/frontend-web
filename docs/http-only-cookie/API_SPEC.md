# Backend API Requirements

The backend must support HTTP-only cookies for this implementation.

## Required Endpoints

### 1. Login

```
POST /api/v1/auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response Headers (CRITICAL):**
```
Set-Cookie: accessToken=<jwt-token>; HttpOnly; Secure; SameSite=Lax; Path=/
Set-Cookie: refreshToken=<refresh-token>; HttpOnly; Secure; SameSite=Lax; Path=/
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 2. Logout

```
POST /api/v1/auth/logout
```

**Response Headers:**
```
Set-Cookie: accessToken=; Max-Age=0; Path=/
Set-Cookie: refreshToken=; Max-Age=0; Path=/
```

**Response Body:**
```json
{
  "success": true,
  "message": "Logged out"
}
```

---

### 3. Refresh Token

```
POST /api/v1/auth/refresh
```

**Request Headers:**
```
Cookie: refreshToken=<refresh-token>
```

**Response Headers:**
```
Set-Cookie: accessToken=<new-jwt-token>; HttpOnly; Secure; SameSite=Lax; Path=/
```

---

### 4. Auth Check (Optional)

```
GET /api/v1/auth/me
```

**Request Headers:**
```
Cookie: accessToken=<jwt-token>
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**If cookie invalid/expired:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```
HTTP Status: 401

---

## CORS Configuration

Backend must set these headers:

```
Access-Control-Allow-Origin: http://localhost:5173  (or production domain)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
```

**Important:** `Access-Control-Allow-Origin` cannot be `*` when using credentials.

---

## Cookie Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `HttpOnly` | Required | Prevents JavaScript access |
| `Secure` | Required (prod) | Only sent over HTTPS |
| `SameSite` | `Lax` | Protects against CSRF |
| `Path` | `/` | Cookie available on all paths |

---

## Security Notes

1. **HTTPS Only** — Never use `Secure` flag on local dev (causes issues)
2. **CSRF Protection** — SameSite=Lax prevents most CSRF attacks
3. **Token Rotation** — Refresh endpoint should issue new tokens