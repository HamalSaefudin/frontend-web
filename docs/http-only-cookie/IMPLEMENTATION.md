# HTTP-Only Cookie Implementation Guide

## Files to Change

### 1. `src/services/api-client.ts`

```typescript
// BEFORE
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')  // ❌ DELETE
  if (token) {
    config.headers.Authorization = `Bearer ${token}`  // ❌ DELETE
  }
  return config
})

// AFTER
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  withCredentials: true,  // ✅ ADD
})

apiClient.interceptors.request.use((config) => {
  // ✅ No token handling - browser sends cookies automatically
  console.log('[API Request]', config.method?.toUpperCase(), config.url)
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ✅ Clear any cached user data, redirect to login
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
```

---

### 2. `src/modules/auth/hooks/useLoginMutation.ts`

```typescript
// BEFORE
onSuccess: (response) => {
  const data = response?.data?.data
  if (data) {
    localStorage.setItem('token', data.accessToken)    // ❌ DELETE
    localStorage.setItem('refreshToken', data.refreshToken)
  }
}

// AFTER
import { useNavigate } from 'react-router-dom'

export function useLoginMutation() {
  const setError = useErrorStore((s) => s.setError)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      fetchDataAsync({
        asyncFn: () => loginApi(credentials),
        setError,
        menuName: "login",
      }),
    onSuccess: (response) => {
      // ✅ Save user info (not token) for UI
      const user = response?.data?.data
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
      navigate('/dashboard')
    },
  })
}
```

---

### 3. `src/modules/auth/hooks/useLogoutMutation.ts`

```typescript
// BEFORE
onSuccess: () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// AFTER
import { useNavigate } from 'react-router-dom'

export function useLogoutMutation() {
  const setError = useErrorStore((s) => s.setError)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () =>
      fetchDataAsync({
        asyncFn: logoutApi,
        setError,
        menuName: 'logout',
      }),
    onSuccess: () => {
      // ✅ Clear cached user, cookies cleared by server
      localStorage.clear()
      navigate('/login')
    },
  })
}
```

---

### 4. `src/layouts/ProtectedLayout.tsx`

```typescript
// BEFORE
const isAuthenticated = () => !!localStorage.getItem('token')

export default function ProtectedLayout() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return <AppLayout />
}

// AFTER
export default function ProtectedLayout() {
  const isAuthenticated = () => !!localStorage.getItem('user')
  
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return <AppLayout />
}
```

---

## Checklist

- [ ] `src/services/api-client.ts` — Add `withCredentials: true`, remove Authorization header
- [ ] `src/modules/auth/hooks/useLoginMutation.ts` — Save user info to localStorage
- [ ] `src/modules/auth/hooks/useLogoutMutation.ts` — Clear localStorage on logout
- [ ] `src/layouts/ProtectedLayout.tsx` — Check for user data in localStorage
- [ ] Test full flow: Login → Navigate → Logout