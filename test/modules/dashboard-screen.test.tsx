import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../utils/render'

vi.mock('@/services/api', () => ({
  fetchUsers: vi.fn(async () => [
    { id: '1', email: 'a@x.com', name: 'Alice', role: 'user' },
    { id: '2', email: 'b@x.com', name: 'Bob', role: 'admin' },
  ]),
  fetchStats: vi.fn(async () => ({
    totalLeads: 10,
    convertedLeads: 4,
    pendingLeads: 6,
    conversionRate: 40,
  })),
  fetchReports: vi.fn(async () => [
    { id: '1', title: 'Q1 Report', author: 'Alice', status: 'published', createdAt: '2024-01-01' },
  ]),
  fetchSettings: vi.fn(async () => ({
    theme: 'light',
    notifications: true,
    language: 'en',
    timezone: 'UTC',
  })),
  fetchLeads: vi.fn(async () => []),
}))

import { DashboardScreen } from '@/modules/dashboard/DashboardScreen'

describe('DashboardScreen', () => {
  it('shows loading overlay initially then stats', async () => {
    renderWithProviders(<DashboardScreen />)
    expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Total Leads')).toBeInTheDocument())
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  it('renders fetched users in users table', async () => {
    renderWithProviders(<DashboardScreen />)
    await waitFor(() => expect(screen.getAllByText('Alice').length).toBeGreaterThan(0))
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('renders settings values', async () => {
    renderWithProviders(<DashboardScreen />)
    await waitFor(() => expect(screen.getByText('light')).toBeInTheDocument())
    expect(screen.getByText('Enabled')).toBeInTheDocument()
  })
})
