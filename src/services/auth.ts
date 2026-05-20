import type { AuthApiResponse, LoginRequest, RegisterRequest } from '../types'
import apiClient from './api-client'

export const registerApi = async (
  data: RegisterRequest,
): Promise<AuthApiResponse> => {
  const response = await apiClient.post<AuthApiResponse>('/api/v1/auth/register', data)
  return response.data
}

export const loginApi = async (
  credentials: LoginRequest,
): Promise<AuthApiResponse> => {
  const response = await apiClient.post<AuthApiResponse>('/api/v1/auth/login', {
    email: credentials.email,
    password: credentials.password,
  })
  console.log(response,'qw')
  return response.data
}

export const logoutApi = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export const refreshTokenApi = async (): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return `mock-token-${Date.now()}`
}
