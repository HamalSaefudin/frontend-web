import type { Lead, Report, Settings, Stats, User } from '../types'
// import apiClient from './api-client'

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'user',
  },
  {
    id: '3',
    email: 'bob@example.com',
    name: 'Bob Johnson',
    role: 'admin',
  },
]

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '555-0001',
    company: 'Acme Corporation',
    status: 'new',
    createdAt: '2024-04-20',
  },
  {
    id: '2',
    name: 'Tech Solutions',
    email: 'info@techsol.com',
    phone: '555-0002',
    company: 'Tech Solutions Inc',
    status: 'contacted',
    createdAt: '2024-04-19',
  },
  {
    id: '3',
    name: 'Global Industries',
    email: 'sales@global.com',
    phone: '555-0003',
    company: 'Global Industries Ltd',
    status: 'qualified',
    createdAt: '2024-04-18',
  },
]

const mockStats: Stats = {
  totalLeads: 150,
  convertedLeads: 45,
  pendingLeads: 105,
  conversionRate: 30,
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Q1 2024 Sales Report',
    createdAt: '2024-04-15',
    author: 'Jane Smith',
    status: 'published',
  },
  {
    id: '2',
    title: 'Lead Performance Analysis',
    createdAt: '2024-04-10',
    author: 'John Doe',
    status: 'published',
  },
  {
    id: '3',
    title: 'Q2 Forecast',
    createdAt: '2024-04-05',
    author: 'Bob Johnson',
    status: 'draft',
  },
]

const mockSettings: Settings = {
  theme: 'light',
  notifications: true,
  language: 'en',
  timezone: 'UTC',
}

export const fetchUsers = async (): Promise<User[]> => {
  // ===== REAL IMPLEMENTATION (UNCOMMENT TO USE) =====
  // const response = await apiClient.get<User[]>('/users')
  // return response.data
  // ===== END REAL IMPLEMENTATION =====

  // Mock implementation - remove this when using real API
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockUsers
}

export const fetchLeads = async (): Promise<Lead[]> => {
  // ===== REAL IMPLEMENTATION (UNCOMMENT TO USE) =====
  // const response = await apiClient.get<Lead[]>('/leads')
  // return response.data
  // ===== END REAL IMPLEMENTATION =====

  // Mock implementation - remove this when using real API
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockLeads
}

export const fetchStats = async (): Promise<Stats> => {
  // ===== REAL IMPLEMENTATION (UNCOMMENT TO USE) =====
  // const response = await apiClient.get<Stats>('/stats')
  // return response.data
  // ===== END REAL IMPLEMENTATION =====

  // Mock implementation - remove this when using real API
  await new Promise((resolve) => setTimeout(resolve, 600))
  return mockStats
}

export const fetchReports = async (): Promise<Report[]> => {
  // ===== REAL IMPLEMENTATION (UNCOMMENT TO USE) =====
  // const response = await apiClient.get<Report[]>('/reports')
  // return response.data
  // ===== END REAL IMPLEMENTATION =====

  // Mock implementation - remove this when using real API
  await new Promise((resolve) => setTimeout(resolve, 900))
  return mockReports
}

export const fetchSettings = async (): Promise<Settings> => {
  // ===== REAL IMPLEMENTATION (UNCOMMENT TO USE) =====
  // const response = await apiClient.get<Settings>('/settings')
  // return response.data
  // ===== END REAL IMPLEMENTATION =====

  // Mock implementation - remove this when using real API
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockSettings
}
