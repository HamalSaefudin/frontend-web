import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '../utils/render'

vi.mock('@/services/master-cabang', () => ({
  fetchBranches: vi.fn(async () => [
    { id: '1', kodeCabang: 'CB001', namaCabang: 'Cabang Jakarta', namaLead: 'Budi' },
    { id: '2', kodeCabang: 'CB002', namaCabang: 'Cabang Bandung', namaLead: 'Sari' },
  ]),
  fetchBranchById: vi.fn(),
  createBranch: vi.fn(),
  updateBranch: vi.fn(),
  deleteBranch: vi.fn(),
  importBranches: vi.fn(),
}))

import { MasterCabangScreen } from '@/modules/master-cabang/MasterCabangScreen'

describe('MasterCabangScreen', () => {
  it('renders branches', async () => {
    renderWithProviders(<MasterCabangScreen />)
    expect(screen.getByRole('heading', { name: /Master Cabang/i })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Cabang Jakarta')).toBeInTheDocument())
    expect(screen.getByText('Cabang Bandung')).toBeInTheDocument()
  })

  it('opens delete dialog with branch name', async () => {
    renderWithProviders(<MasterCabangScreen />)
    await waitFor(() => expect(screen.getByText('Cabang Jakarta')).toBeInTheDocument())
    const deleteBtns = screen.getAllByTitle('Delete')
    await userEvent.click(deleteBtns[0])
    expect(screen.getByText(/Delete Branch/)).toBeInTheDocument()
    expect(screen.getAllByText(/Cabang Jakarta/).length).toBeGreaterThan(1)
  })
})
