import axios, { type AxiosInstance } from 'axios'

// Use relative URL in dev (via Vite proxy) or absolute URL in production
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    console.log('[API Config] Using VITE_API_URL:', import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL
  }
  if (import.meta.env.DEV) {
    console.log('[API Config] DEV mode - using relative URL (proxy)')
    return ''  // Relative URL - goes through Vite proxy
  }
  console.log('[API Config] Production - using absolute URL')
  return 'http://192.168.19.247:8080'
}

const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('[API Request]', config.method?.toUpperCase(), config.url, '| baseURL:', apiClient.defaults.baseURL, '| hasToken:', !!token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient