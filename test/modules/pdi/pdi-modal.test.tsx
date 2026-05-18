import { describe, expect, it, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '../../utils/render'
import type { PdiUnit } from '@/types'

vi.mock('@/services/pdi', () => ({
  fetchPdiUnits: vi.fn(),
  fetchPdiData: vi.fn(async () => ({
    unitId: 'pdi-1',
    unit: {} as PdiUnit,
    checklist: [
      { id: 'c-1', namaItem: 'Lampu depan', status: 'OK' },
      { id: 'c-2', namaItem: 'Spion', status: 'NOT_OK', notes: 'retak' },
    ],
    ksu: [{ id: 'k-1', namaItem: 'Helm', jumlah: 2, kondisi: 'BAIK' }],
    hadiah: [],
    barangLain: [],
    parts: [],
    photos: [],
  })),
  savePdiChecklist: vi.fn(async () => ({ success: true })),
  savePdiKsu: vi.fn(async () => ({ success: true })),
  savePdiHadiah: vi.fn(async () => ({ success: true })),
  savePdiBarangLain: vi.fn(async () => ({ success: true })),
  savePdiPart: vi.fn(async () => ({ success: true })),
  uploadPdiPhoto: vi.fn(),
  deletePdiPhoto: vi.fn(),
  processPdi: vi.fn(async () => ({ success: true })),
  rejectPdi: vi.fn(async () => ({ success: true })),
}))

vi.mock('@/services/master-cabang', () => ({
  fetchBranches: vi.fn(async () => []),
}))

import { PdiModal } from '@/modules/pdi/components/PdiModal'
import * as pdiService from '@/services/pdi'

const mockUnit: PdiUnit = {
  id: 'pdi-1',
  noFj: 'FJ-001',
  tanggalFj: '2026-04-20',
  kodeVarian: 'VAR-125',
  namaVarian: 'Vario 125',
  kodeWarna: 'W-RED',
  namaWarna: 'Merah',
  nomorMesin: 'ME-1001',
  nomorRangka: 'RA-2001',
  status: 'BELUM_PDI',
  cabangId: 'cb-1',
  cabangName: 'Jakarta Pusat',
  tipeUnit: 'Scooter',
  noPdi: 'PDI-001',
  keterangan: 'test',
}

describe('PdiModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal with unit details (disabled inputs)', async () => {
    renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={mockUnit} />,
    )
    await waitFor(() => {
      expect(screen.getByDisplayValue('Jakarta Pusat')).toBeInTheDocument()
    })
    expect(screen.getByDisplayValue('FJ-001')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ME-1001')).toBeInTheDocument()
    expect(screen.getByDisplayValue('RA-2001')).toBeInTheDocument()
    // Disabled, not editable
    expect(screen.getByDisplayValue('Jakarta Pusat')).toBeDisabled()
  })

  it('renders all 6 tabs', async () => {
    renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={mockUnit} />,
    )
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Cek Fisik Unit/i })).toBeInTheDocument()
    })
    expect(screen.getByRole('tab', { name: /^KSU$/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Hadiah/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Barang Lain/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /^Part$/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Foto/i })).toBeInTheDocument()
  })

  it('renders footer action buttons', async () => {
    renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={mockUnit} />,
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: /Simpan/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tolak/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Proses/i })).toBeInTheDocument()
  })

  it('loads existing checklist into form (no white screen)', async () => {
    renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={mockUnit} />,
    )
    // CekFisikTab is the default tab — render checklist labels
    await waitFor(() => {
      expect(screen.getByText('Lampu depan')).toBeInTheDocument()
    })
    expect(screen.getByText('Spion')).toBeInTheDocument()
  })

  it('loads existing KSU items in display mode', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={mockUnit} />,
    )
    // Wait for data load, then switch to KSU tab
    await waitFor(() =>
      expect(screen.getByRole('tab', { name: /^KSU$/i })).toBeInTheDocument(),
    )
    await user.click(screen.getByRole('tab', { name: /^KSU$/i }))
    await waitFor(() => expect(screen.getByText('Helm')).toBeInTheDocument())
    // Existing items must be saved (display mode), not editable
    expect(screen.queryByDisplayValue('Helm')).not.toBeInTheDocument()
  })

  it('clicking Simpan calls all save mutations in parallel', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={mockUnit} />,
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Simpan/i })).toBeInTheDocument(),
    )
    await user.click(screen.getByRole('button', { name: /Simpan/i }))
    await waitFor(() => {
      expect(pdiService.savePdiChecklist).toHaveBeenCalledTimes(1)
      expect(pdiService.savePdiKsu).toHaveBeenCalledTimes(1)
      expect(pdiService.savePdiHadiah).toHaveBeenCalledTimes(1)
      expect(pdiService.savePdiBarangLain).toHaveBeenCalledTimes(1)
      expect(pdiService.savePdiPart).toHaveBeenCalledTimes(1)
    })
  })

  it('Simpan strips isSaved field before calling savePdiKsu', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={mockUnit} />,
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Simpan/i })).toBeInTheDocument(),
    )
    await user.click(screen.getByRole('button', { name: /Simpan/i }))
    await waitFor(() => expect(pdiService.savePdiKsu).toHaveBeenCalled())

    const ksuCall = vi.mocked(pdiService.savePdiKsu).mock.calls[0]
    const [, ksuItems] = ksuCall as unknown as [string, Array<Record<string, unknown>>]
    for (const item of ksuItems) {
      expect(item).not.toHaveProperty('isSaved')
    }
  })

  it('clicking Tolak calls rejectPdi with unit id', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={mockUnit} />,
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Tolak/i })).toBeInTheDocument(),
    )
    await user.click(screen.getByRole('button', { name: /Tolak/i }))
    await waitFor(() => {
      expect(pdiService.rejectPdi).toHaveBeenCalledWith('pdi-1')
    })
  })

  it('clicking Proses calls processPdi with unit id', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={mockUnit} />,
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Proses/i })).toBeInTheDocument(),
    )
    await user.click(screen.getByRole('button', { name: /Proses/i }))
    await waitFor(() => {
      expect(pdiService.processPdi).toHaveBeenCalledWith('pdi-1')
    })
  })

  it('returns null when unit is null', () => {
    const { container } = renderWithProviders(
      <PdiModal open={true} onOpenChange={() => {}} unit={null} />,
    )
    expect(container.textContent).toBe('')
  })
})
