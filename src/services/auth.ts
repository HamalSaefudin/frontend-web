import type { LoginRequest, RegisterRequest } from '../types'
import type { IBaseResponse } from '@/types'
import apiClient from './api-client'

export const registerApi = async (data: RegisterRequest) => {
  return await apiClient.post<IBaseResponse<{ accessToken: string; refreshToken: string }>>('/api/v1/auth/register', data)
}

export const loginApi = async (credentials: LoginRequest) => {
  return await apiClient.post<IBaseResponse<{ accessToken: string; refreshToken: string }>>('/api/v1/auth/login', {
    email: credentials.email,
    password: credentials.password,
  })
}

export const logoutApi = async () => {
  return await apiClient.post<IBaseResponse<void>>('/api/v1/auth/logout')
}

export const refreshTokenApi = async () => {
  return await apiClient.post<IBaseResponse<{ token: string }>>('/api/v1/auth/refresh')
}