# CSRF Protection for httpOnly Cookie Auth

Moving from localStorage to httpOnly cookies introduces CSRF risk.
This document covers the strategy to mitigate it.

---

## The Problem

With localStorage, the frontend manually adds the `Authorization` header.
Browsers never send localStorage content automatically — CSRF is not a concern.

With httpOnly cookies, the browser **automatically sends** cookies on every request.
If a user visits a malicious site while logged in, that site could forge requests
to your API — and the browser would include the auth cookie.

---

## The Solution: Double-Submit Cookie Pattern

Two cookies are set on login:

| Cookie | HttpOnly | Purpose |
|--------|----------|---------|
| `accessToken` | Yes | Auth — JS cannot read |
| `XSRF-TOKEN` | **No** | CSRF token — JS reads it, sends as header |

### Flow

```
1. POST /api/v1/auth/login
   Response sets:
     Set-Cookie: accessToken=<jwt>; HttpOnly; Secure; SameSite=Lax; Path=/
     Set-Cookie: XSRF-TOKEN=<uuid>; Secure; SameSite=Lax; Path=/

2. Frontend reads XSRF-TOKEN from document.cookie
   (Cannot read accessToken — it's HttpOnly)

3. Every POST/PUT/PATCH/DELETE request includes:
     X-XSRF-TOKEN: <uuid-from-cookie>

4. Backend validates:
     X-XSRF-TOKEN header === XSRF-TOKEN cookie
     Mismatch → 403 Forbidden
```

### Why This Stops CSRF

1. **Custom headers trigger CORS preflight** — the browser sends an `OPTIONS`
   request first to check permissions. A malicious site cannot pass CORS checks.

2. **Cross-origin cookie isolation** — `evil.com` cannot read `example.com`'s cookies,
   so it can't forge the `X-XSRF-TOKEN` header value.

3. **Defense in depth** — Even if `SameSite=Lax` fails (old browser), or if cookies
   leak via subdomain attack, the CSRF token still blocks forged requests.

---

## Cookie Attributes

| Cookie | HttpOnly | Secure | SameSite | Path |
|--------|----------|--------|----------|------|
| `accessToken` | Yes | Yes (prod) | Lax | `/` |
| `refreshToken` | Yes | Yes (prod) | Lax | `/` |
| `XSRF-TOKEN` | **No** | Yes (prod) | Lax | `/` |

`XSRF-TOKEN` must NOT be HttpOnly — the frontend needs to read it.

---

## Backend Validation Rules

| Method | Header Required | Action on Mismatch |
|--------|-----------------|--------------------|
| GET | No | N/A |
| HEAD | No | N/A |
| OPTIONS | No | N/A |
| POST | Yes | 403 |
| PUT | Yes | 403 |
| PATCH | Yes | 403 |
| DELETE | Yes | 403 |

---

## CORS Configuration

```
Access-Control-Allow-Origin: http://localhost:5173   # or production domain
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-XSRF-TOKEN
Access-Control-Allow-Credentials: true
```

`Access-Control-Allow-Headers` must include `X-XSRF-TOKEN` so the browser
can send it after the preflight check.

---

## Frontend Implementation

### New utility: `src/utils/csrf.ts`

```typescript
export function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}
```

### Axios interceptor (in `src/services/api-client.ts`)

```typescript
import { getCsrfToken } from '@/utils/csrf'

apiClient.interceptors.request.use((config) => {
  if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken
    }
  }
  return config
})
```

### 403 handling (in `src/services/api-client.ts`)

```typescript
if (error.response?.status === 403) {
  localStorage.clear()
  window.location.href = '/login'
}
```

---

## Security Comparison

| Threat | localStorage | httpOnly + SameSite=Lax only | httpOnly + Double-Submit |
|--------|-------------|------------------------------|--------------------------|
| XSS steals token | ❌ Vulnerable | ✅ Protected | ✅ Protected |
| CSRF (form submit) | ✅ N/A | ⚠️ Depends on browser | ✅ Protected |
| CSRF (old browser) | ✅ N/A | ❌ Vulnerable | ✅ Protected |
| CSRF (subdomain attack) | ✅ N/A | ❌ Vulnerable | ✅ Protected |

---

## References

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Double Submit Cookie Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie)
- [MDN SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
