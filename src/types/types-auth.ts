export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface TokenData {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface AuthApiResponse {
  success: boolean
  code: string
  message: string
  data: TokenData
}