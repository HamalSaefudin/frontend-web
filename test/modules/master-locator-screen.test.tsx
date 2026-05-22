import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '../utils/render'

vi.mock('@/services/master-locator', () => ({
  getLokasiList: vi.fn(async () => ({
    success: true,
    code: 'LOKASI_LIST_SUCCESS',
    message: 'Success',
    data: {
      items: [
        { id: '1', kodeLokasi: 'WH-JKT-01', kodeCabang: 'JKT01', namaLokasi: 'Warehouse Jakarta Utama', status: 'ACTIVE' },
        { id: '2', kodeLokasi: 'WH-SBY-01', kodeCabang: 'SBY01', namaLokasi: 'Warehouse Surabaya Barat', status: 'INACTIVE' },
      ],
      total: 2,
    },
    errors: [],
  })),
  getLokasiDetail: vi.fn(),
  createLokasi: vi.fn(),
  updateLokasi: vi.fn(),
  deleteLokasi: vi.fn(),
  updateLokasiStatus: vi.fn(),
}))

import { MasterLocatorScreen } from '@/modules/master-locator/MasterLocatorScreen'

describe('MasterLocatorScreen', () => {
  it('renders lokasi warehouse list', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    expect(screen.getByRole('heading', { name: /Master Lokasi Warehouse/i })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('WH-JKT-01')).toBeInTheDocument())
    expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument()
  })

  it('opens delete dialog with lokasi name', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    const deleteBtns = screen.getAllByTitle('Hapus')
    await userEvent.click(deleteBtns[0])
    expect(screen.getByText(/Hapus Lokasi Warehouse/)).toBeInTheDocument()
    expect(screen.getAllByText(/Warehouse Jakarta Utama/).length).toBeGreaterThan(1)
  })

  it('opens create modal when clicking tambah button', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    const tambahBtn = screen.getByRole('button', { name: /tambah/i })
    await userEvent.click(tambahBtn)
    expect(screen.getByText('Tambah Lokasi Warehouse')).toBeInTheDocument()
  })

  it('opens filter popup when clicking filter button', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    const filterBtn = screen.getByRole('button', { name: /filter/i })
    await userEvent.click(filterBtn)
    expect(screen.getByText('Filter Lokasi Warehouse')).toBeInTheDocument()
  })
})