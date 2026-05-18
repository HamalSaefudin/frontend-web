import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../utils/render'

vi.mock('@/services/pdi', () => ({
  fetchPdiUnits: vi.fn(async () => ({
    data: [
      { id: 'pdi-1', noFj: 'FJ-001', tanggalFj: '2026-04-20', kodeVarian: 'VAR-125', namaVarian: 'Vario 125', kodeWarna: 'W-RED', namaWarna: 'Merah', nomorMesin: 'ME-1001', nomorRangka: 'RA-2001', status: 'BELUM_PDI', cabangId: 'cb-1', cabangName: 'Jakarta Pusat', tipeUnit: 'Scooter' },
      { id: 'pdi-2', noFj: 'FJ-002', tanggalFj: '2026-04-21', kodeVarian: 'VAR-150', namaVarian: 'Vario 150', kodeWarna: 'W-BLK', namaWarna: 'Hitam', nomorMesin: 'ME-1002', nomorRangka: 'RA-2002', status: 'SUDAH_PDI', cabangId: 'cb-1', cabangName: 'Jakarta Pusat', tipeUnit: 'Scooter' },
    ],
    total: 2,
  })),
  fetchPdiData: vi.fn(),
  savePdiChecklist: vi.fn(),
  savePdiKsu: vi.fn(),
  savePdiHadiah: vi.fn(),
  savePdiBarangLain: vi.fn(),
  savePdiPart: vi.fn(),
  uploadPdiPhoto: vi.fn(),
  deletePdiPhoto: vi.fn(),
  processPdi: vi.fn(),
  rejectPdi: vi.fn(),
}))

vi.mock('@/services/master-cabang', () => ({
  fetchBranches: vi.fn(async () => [
    { id: 'cb-1', kodeCabang: 'CB001', namaCabang: 'Jakarta Pusat', namaLead: 'Budi' },
    { id: 'cb-2', kodeCabang: 'CB002', namaCabang: 'Bandung', namaLead: 'Sari' },
  ]),
}))

import { PdiScreen } from '@/modules/pdi/PdiScreen'

describe('PdiScreen', () => {
  it('renders PDI page with title', async () => {
    renderWithProviders(<PdiScreen />)
    expect(screen.getByRole('heading', { name: /Pre Delivery Inspection/i })).toBeInTheDocument()
  })

  it('renders branch dropdown with default selection', async () => {
    renderWithProviders(<PdiScreen />)
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Pilih Cabang')
      expect(input).toBeInTheDocument()
    })
  })

  it('renders tabs', async () => {
    renderWithProviders(<PdiScreen />)
    expect(screen.getByRole('tab', { name: /Belum PDI/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Sudah PDI/i })).toBeInTheDocument()
  })

  it('renders table with PDI units', async () => {
    renderWithProviders(<PdiScreen />)
    await waitFor(() => expect(screen.getByText('FJ-001')).toBeInTheDocument())
    expect(screen.getByText('FJ-002')).toBeInTheDocument()
  })

  it('renders Proses PDI button', async () => {
    renderWithProviders(<PdiScreen />)
    await waitFor(() => {
      const buttons = screen.getAllByRole('button', { name: /Proses PDI/i })
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  it('displays filter options', async () => {
    renderWithProviders(<PdiScreen />)
    expect(screen.getByText(/Nomor Mesin/i)).toBeInTheDocument()
    expect(screen.getByText(/Kode Varian/i)).toBeInTheDocument()
  })

  it('displays search button', async () => {
    renderWithProviders(<PdiScreen />)
    expect(screen.getByRole('button', { name: /Cari/i })).toBeInTheDocument()
  })
})