# How HTTP-Only Cookie Auth Works

## Comparison: localStorage vs HTTP-Only Cookie

### localStorage (Current)

```
1. Login → Server returns: { accessToken: "abc123" }
2. Frontend → localStorage.setItem('token', 'abc123')
3. Every request → You add header: Authorization: Bearer abc123
4. XSS attack → Hacker reads localStorage → steals token
```

### HTTP-Only Cookie (Target)

```
1. Login → Server returns Set-Cookie header (NOT in body)
   
   Response Headers:
   Set-Cookie: accessToken=abc123; HttpOnly; Secure; SameSite=Lax
   
2. Browser → AUTOMATICALLY stores cookie (JS can't read HttpOnly)
3. Every request → Browser AUTOMATICALLY sends cookie
4. XSS attack → Cookie cannot be read by JS → protected
```

---

## Key Differences

| | localStorage | HTTP-Only Cookie |
|--|--|--|
| **Who saves** | Your code: `localStorage.setItem()` | Browser reads `Set-Cookie` header |
| **Who sends** | Your code adds `Authorization` header | Browser sends automatically |
| **JS access** | Yes — vulnerable to XSS | No — protected by HttpOnly |
| **Expiry handling** | You check manually | Server sets cookie expiry |

---

## Why `withCredentials: true`?

Without it, browsers block cookies (CORS security).

With `withCredentials: true`:
- ✅ Send cookies with cross-origin requests
- ✅ Accept cookies from server

---

## Auth Check Options

### Option A: Call `/me` on every page load

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["auth", "me"],
  queryFn: () => getCurrentUser(),
})
```

**Flow:**
- User navigates → ProtectedLayout mounts
- → Calls `/api/v1/auth/me`
- → Cookie sent automatically by browser
- → Server validates, returns user
- → If 401 → redirect to login

**Pros:** Always fresh user data  
**Cons:** Extra API call on every navigation

---

### Option B: Cache user in localStorage (Recommended)

```typescript
// useLoginMutation.ts
onSuccess: (response) => {
  const user = response?.data?.data
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

// ProtectedLayout.tsx
const isAuthenticated = () => !!localStorage.getItem('user')
```

**Flow:**
- User logs in → Save user info to localStorage
- User navigates → Check localStorage for user
- Any API call → Cookie sent automatically
- If API returns 401 → Interceptor clears localStorage, redirects to login

**Pros:** No extra API call  
**Cons:** Slightly less real-time

---

## Token Storage Locations to Remove

| File | Line | Code to DELETE |
|------|------|----------------|
| `api-client.ts` | 26-30 | `localStorage.getItem('token')` + Authorization header |
| `api-client.ts` | 38-39 | `localStorage.removeItem('token')` on 401 |
| `useLoginMutation.ts` | 17-22 | `localStorage.setItem('token', ...)` |
| `ProtectedLayout.tsx` | 4 | `localStorage.getItem('token')` check |