import type { AuthApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types'
import apiClient from './api-client'

export const registerApi = async (
  data: RegisterRequest,
): Promise<AuthApiResponse> => {
  // ===== REAL IMPLEMENTATION =====
  const response = await apiClient.post<AuthApiResponse>('/api/v1/auth/register', data)
  return response.data
  // ===== END REAL IMPLEMENTATION =====

  // Mock implementation - remove this when using real API
  // await new Promise((resolve) => setTimeout(resolve, 800))
  // return {
  //   success: true,
  //   code: 'REGISTER_SUCCESS',
  //   message: 'Registration successful',
  //   data: {
  //     accessToken: `mock-token-${Date.now()}`,
  //     refreshToken: `mock-refresh-${Date.now()}`,
  //     expiresIn: 86400,
  //     tokenType: 'Bearer',
  //   },
  // }
}

export const loginApi = async (
  credentials: LoginRequest,
): Promise<AuthApiResponse> => {
  // ===== REAL IMPLEMENTATION =====
  const response = await apiClient.post<AuthApiResponse>('/api/v1/auth/login', {
    email: credentials.email,
    password: credentials.password,
  })
  return response.data
}

export const logoutApi = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export const refreshTokenApi = async (): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return `mock-token-${Date.now()}`
}
