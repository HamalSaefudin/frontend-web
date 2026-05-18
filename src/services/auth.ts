import type { AuthResponse, LoginRequest } from '../types'
// import apiClient from './api-client'

const mockUsers: Record<string, { password: string }> = {
  'admin': { password: 'admin' },
  'admin@example.com': { password: 'admin123' },
}

export const loginApi = async (
  credentials: LoginRequest,
): Promise<AuthResponse> => {
  // ===== REAL IMPLEMENTATION (UNCOMMENT TO USE) =====
  // const response = await apiClient.post<AuthResponse>('/auth/login', {
  //   email: credentials.email,
  //   password: credentials.password,
  // })
  // return response.data
  // ===== END REAL IMPLEMENTATION =====

  // Mock implementation - remove this when using real API
  await new Promise((resolve) => setTimeout(resolve, 800))

  const user = mockUsers[credentials.email]
  if (!user || user.password !== credentials.password) {
    throw new Error('Invalid email or password')
  }

  return {
    user: {
      id: '1',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      role: credentials.email === 'admin@example.com' ? 'admin' : 'user',
    },
    token: `mock-token-${Date.now()}`,
  }
}

export const logoutApi = async (): Promise<void> => {
  // ===== REAL IMPLEMENTATION (UNCOMMENT TO USE) =====
  // await apiClient.post('/auth/logout')
  // ===== END REAL IMPLEMENTATION =====

  // Mock implementation - remove this when using real API
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export const refreshTokenApi = async (): Promise<string> => {
  // ===== REAL IMPLEMENTATION (UNCOMMENT TO USE) =====
  // const response = await apiClient.post<{ token: string }>('/auth/refresh')
  // return response.data.token
  // ===== END REAL IMPLEMENTATION =====

  // Mock implementation - remove this when using real API
  await new Promise((resolve) => setTimeout(resolve, 500))
  return `mock-token-${Date.now()}`
}
