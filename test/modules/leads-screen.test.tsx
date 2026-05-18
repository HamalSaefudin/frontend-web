import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '../utils/render'

vi.mock('@/services/api', () => ({
  fetchLeads: vi.fn(async () => [
    {
      id: '1',
      name: 'Acme Corp',
      email: 'a@acme.com',
      phone: '555-0001',
      company: 'Acme',
      status: 'new',
      createdAt: '2024-04-20',
    },
    {
      id: '2',
      name: 'Globex',
      email: 'g@globex.com',
      phone: '555-0002',
      company: 'Globex',
      status: 'qualified',
      createdAt: '2024-04-22',
    },
  ]),
}))

import { LeadsScreen } from '@/modules/leads/LeadsScreen'

describe('LeadsScreen', () => {
  it('renders leads after load', async () => {
    renderWithProviders(<LeadsScreen />)
    await waitFor(() => expect(screen.getAllByText('Acme Corp').length).toBeGreaterThan(0))
    expect(screen.getAllByText('Globex').length).toBeGreaterThan(0)
  })

  it('opens edit modal on Edit click', async () => {
    renderWithProviders(<LeadsScreen />)
    await waitFor(() => expect(screen.getAllByText('Acme Corp').length).toBeGreaterThan(0))
    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    await userEvent.click(editButtons[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Edit Lead/i)).toBeInTheDocument()
  })
})
