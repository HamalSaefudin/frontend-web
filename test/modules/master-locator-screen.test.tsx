import { describe, expect, it, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '../utils/render'

// Mock the master-locator service
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
  getLokasiDetail: vi.fn(async () => ({
    success: true,
    code: 'LOKASI_DETAIL_SUCCESS',
    message: 'Success',
    data: { id: '1', kodeLokasi: 'WH-JKT-01', kodeCabang: 'JKT01', namaLokasi: 'Warehouse Jakarta Utama', status: 'ACTIVE' },
    errors: [],
  })),
  createLokasi: vi.fn(async () => ({
    success: true,
    code: 'LOKASI_CREATE_SUCCESS',
    message: 'Success',
    data: { id: '3' },
    errors: [],
  })),
  updateLokasi: vi.fn(async () => ({
    success: true,
    code: 'LOKASI_UPDATE_SUCCESS',
    message: 'Success',
    data: { lokasiId: '1' },
    errors: [],
  })),
  updateLokasiStatus: vi.fn(async () => ({
    success: true,
    code: 'LOKASI_STATUS_SUCCESS',
    message: 'Success',
    data: { lokasiId: '1', status: 'INACTIVE' },
    errors: [],
  })),
  filterLokasi: vi.fn(async () => ({
    success: true,
    code: 'LOKASI_FILTER_SUCCESS',
    message: 'Success',
    data: {
      items: [
        { id: '1', kodeLokasi: 'WH-JKT-01', kodeCabang: 'JKT01', namaLokasi: 'Warehouse Jakarta Utama', status: 'ACTIVE' },
        { id: '2', kodeLokasi: 'WH-SBY-01', kodeCabang: 'SBY01', namaLokasi: 'Warehouse Surabaya Barat', status: 'INACTIVE' },
      ],
      totalElements: 2,
    },
    errors: [],
  })),
}))

import { MasterLocatorScreen } from '@/modules/master-locator/MasterLocatorScreen'
import * as masterLocatorService from '@/services/master-locator'

describe('MasterLocatorScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ====== Existing Tests ======

  it('renders lokasi warehouse list', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    expect(screen.getByRole('heading', { name: /Master Lokasi Warehouse/i })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('WH-JKT-01')).toBeInTheDocument())
    expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument()
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

  // ====== New Tests: Edit Functionality ======

  it('opens edit modal when clicking edit button with pre-filled data', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    
    // Find edit button by title "Lihat/Ubah"
    const editBtns = screen.getAllByTitle('Lihat/Ubah')
    await userEvent.click(editBtns[0])
    
    // Modal should open with edit title
    expect(screen.getByText('Edit Lokasi Warehouse')).toBeInTheDocument()
    
    // Form should have pre-filled values - find input by placeholder in form
    await waitFor(() => {
      const kodeLokasiInput = screen.getByPlaceholderText('Contoh: WH-JKT-01') as HTMLInputElement
      expect(kodeLokasiInput.value).toBe('WH-JKT-01')
    })
  })

  // ====== New Tests: Form Validation ======

  it('shows validation errors when submitting empty create form', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    
    // Open create modal
    const tambahBtn = screen.getByRole('button', { name: /tambah/i })
    await userEvent.click(tambahBtn)
    
    // Wait for modal to render
    await waitFor(() => expect(screen.getByText('Tambah Lokasi Warehouse')).toBeInTheDocument())
    
    // Submit empty form
    const submitBtn = screen.getByRole('button', { name: /simpan/i })
    await userEvent.click(submitBtn)
    
    // Check for validation errors (all 3 fields are required)
    await waitFor(() => {
      const validationErrors = screen.getAllByText(/wajib/i)
      expect(validationErrors.length).toBeGreaterThanOrEqual(3)
    })
  })

  // ====== New Tests: Form Submission ======

  it('can fill create form fields and submit button is enabled', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    
    // Open create modal
    const tambahBtn = screen.getByRole('button', { name: /tambah/i })
    await userEvent.click(tambahBtn)
    
    await waitFor(() => expect(screen.getByText('Tambah Lokasi Warehouse')).toBeInTheDocument())
    
    // Fill form fields - use placeholders to find inputs
    const kodeLokasiInput = screen.getByPlaceholderText('Contoh: WH-JKT-01') as HTMLInputElement
    const namaLokasiInput = screen.getByPlaceholderText('Contoh: Warehouse Jakarta Utama') as HTMLInputElement
    
    await userEvent.type(kodeLokasiInput, 'WH-BDG-01')
    await userEvent.type(namaLokasiInput, 'Warehouse Bandung Utama')
    
    // Submit button should be enabled after filling form
    const submitBtn = screen.getByRole('button', { name: /simpan/i })
    expect(submitBtn).not.toBeDisabled()
  })

  // ====== New Tests: Status Toggle ======

  it('calls updateLokasiStatus when toggling status switch', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    
    // Get the switch for the first row (ACTIVE status)
    const switches = screen.getAllByRole('switch')
    expect(switches[0]).toBeChecked() // First item is ACTIVE
    
    // Toggle the switch
    await userEvent.click(switches[0])
    
    // Verify updateLokasiStatus was called
    await waitFor(() => {
      expect(masterLocatorService.updateLokasiStatus).toHaveBeenCalledWith('1', 'INACTIVE')
    })
  })

  // ====== New Tests: Inline Search ======

  it('triggers search when clicking cari button with input', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('Cari Kode Lokasi...')
    await userEvent.type(searchInput, 'WH-JKT')
    
    // Click cari button
    const cariBtn = screen.getByRole('button', { name: /cari/i })
    await userEvent.click(cariBtn)
    
    // Verify filterLokasi was called with search params
    await waitFor(() => {
      expect(masterLocatorService.filterLokasi).toHaveBeenCalledWith(
        expect.objectContaining({ kodeLokasi: 'WH-JKT' })
      )
    })
  })

  // ====== New Tests: Form Cancel ======

  it('closes edit modal when clicking batal', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    
    // Open edit modal
    const editBtns = screen.getAllByTitle('Lihat/Ubah')
    await userEvent.click(editBtns[0])
    
    await waitFor(() => expect(screen.getByText('Edit Lokasi Warehouse')).toBeInTheDocument())
    
    // Click batal button
    const batalBtn = screen.getByRole('button', { name: /batal/i })
    await userEvent.click(batalBtn)
    
    // Modal should be closed
    expect(screen.queryByText('Edit Lokasi Warehouse')).not.toBeInTheDocument()
    
    // updateLokasi should not have been called
    expect(masterLocatorService.updateLokasi).not.toHaveBeenCalled()
  })

  // ====== New Tests: Edit Form Submission ======

  it('can fill edit form fields and submit button is enabled', async () => {
    renderWithProviders(<MasterLocatorScreen />)
    await waitFor(() => expect(screen.getByText('Warehouse Jakarta Utama')).toBeInTheDocument())
    
    // Open edit modal
    const editBtns = screen.getAllByTitle('Lihat/Ubah')
    await userEvent.click(editBtns[0])
    
    await waitFor(() => expect(screen.getByText('Edit Lokasi Warehouse')).toBeInTheDocument())
    
    // Update the namaLokasi field (kodeLokasi should be disabled) - use placeholder to find input
    const namaLokasiInput = screen.getByPlaceholderText('Contoh: Warehouse Jakarta Utama') as HTMLInputElement
    await userEvent.clear(namaLokasiInput)
    await userEvent.type(namaLokasiInput, 'Warehouse Jakarta Updated')
    
    // Submit button should be enabled after filling form
    const submitBtn = screen.getByRole('button', { name: /simpan/i })
    expect(submitBtn).not.toBeDisabled()
  })
})
