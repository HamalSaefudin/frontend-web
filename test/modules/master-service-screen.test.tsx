import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../utils/render'

vi.mock('@/services/master-service', () => ({
  fetchBranches: vi.fn(async () => [
    { id: '1', kodeCabang: 'CB001', namaCabang: 'Cabang Jakarta' },
  ]),
  fetchServices: vi.fn(async (branchId?: string) => {
    if (!branchId) return []
    return [
      { id: 's1', kodeJasa: 'J001', namaJasa: 'Service Alpha', servisCategory: 'Maintenance', kodeHarian: 'H001', namaVarian: 'V1', kodeVarian: 'KV1', branchId },
    ]
  }),
  createService: vi.fn(),
  updateService: vi.fn(),
  deleteService: vi.fn(),
}))

import { MasterServiceScreen } from '@/modules/master-service/MasterServiceScreen'

describe('MasterServiceScreen', () => {
  it('auto-selects first branch and renders services', async () => {
    renderWithProviders(<MasterServiceScreen />)
    await waitFor(() => expect(screen.getByText('Service Alpha')).toBeInTheDocument())
    expect(screen.getByText('J001')).toBeInTheDocument()
  })
})
