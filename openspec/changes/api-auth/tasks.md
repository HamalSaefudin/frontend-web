# Tasks: API Auth Implementation

## Overview
Implement register and login API functionality based on `docs/auth/curl-commands.md`

## API Endpoints (from curl-commands.md)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Register new user |
| `/api/v1/auth/login` | POST | Login & get JWT token |

## Request/Response Contracts

### Register
**Request:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "YourSecurePassword123!"
}
```

**Response:**
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

### Login
**Request:**
```json
{
  "email": "admin@example.com",
  "password": "YourSecurePassword123!"
}
```

**Response:** Same structure as register

---

## Tasks

### Phase 1: Type Definitions

- [x] 1. Add `RegisterRequest` type with name, email, password fields
- [x] 2. Add `TokenData` type with accessToken, refreshToken, expiresIn, tokenType
- [x] 3. Add `AuthApiResponse` type wrapping TokenData
- [x] 4. Update `AuthResponse` to include tokenType and use TokenData structure

### Phase 2: API Service

- [x] 5. Add `registerApi` function calling `POST /api/v1/auth/register`
- [x] 6. Update `loginApi` to match API contract (use accessToken instead of token)
- [x] 7. Update types to match API response structure

### Phase 3: Register Hook

- [x] 8. Create `useRegisterMutation` hook
- [x] 9. Export hooks from `modules/auth/hooks/index.ts`

### Phase 4: Register Screen

- [x] 10. Create `RegisterScreen.tsx` with form (name, email, password)
- [x] 11. Add `register.css` styling
- [x] 12. Add route `/register` in `App.tsx`

### Phase 5: Login Screen Updates

- [x] 13. Add "Create Account" button linking to register screen

---

## Dependencies
- None (task-only schema)

## Notes
- Base URL: `http://localhost:8080`
- API path: `/api/v1/auth/*`
- Use Zod for form validation
- Include React Hook Form pattern