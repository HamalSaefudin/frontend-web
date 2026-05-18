import { describe, expect, it, beforeEach } from 'vitest'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, within } from '../../utils/render'
import { KsuTab } from '@/modules/pdi/components/tabs/KsuTab'
import {
  pdiFormSchema,
  type PdiFormData,
} from '@/modules/pdi/schemas/validationSchemas'

const emptyForm: PdiFormData = {
  checklist: [],
  ksu: [],
  hadiah: [],
  barangLain: [],
  parts: [],
  photos: [],
}

function Harness({ initial = emptyForm }: { initial?: PdiFormData }) {
  const methods = useForm<PdiFormData>({
    resolver: zodResolver(pdiFormSchema),
    defaultValues: initial,
  })
  return (
    <FormProvider {...methods}>
      <KsuTab />
    </FormProvider>
  )
}

describe('KsuTab', () => {
  beforeEach(() => {
    // happy-dom doesn't always reset focus between tests
    document.body.innerHTML = ''
  })

  it('shows empty state when no items', () => {
    renderWithProviders(<Harness />)
    expect(screen.getByText(/Belum ada item KSU/i)).toBeInTheDocument()
  })

  it('renders existing items in display mode (read-only text)', () => {
    renderWithProviders(
      <Harness
        initial={{
          ...emptyForm,
          ksu: [
            { id: 'k-1', namaItem: 'Helm', jumlah: 2, kondisi: 'BAIK', isSaved: true },
          ],
        }}
      />,
    )
    expect(screen.getByText('Helm')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('BAIK')).toBeInTheDocument()
    // No input rendered because isSaved=true
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('Tambah button appends a row in edit mode', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Harness />)

    await user.click(screen.getByRole('button', { name: /Tambah/i }))

    // After add, an input should appear (isSaved = false)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThan(0)
    // Empty state message gone
    expect(screen.queryByText(/Belum ada item KSU/i)).not.toBeInTheDocument()
  })

  it('typing in input does not lose focus between keystrokes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Harness />)
    await user.click(screen.getByRole('button', { name: /Tambah/i }))

    const inputs = screen.getAllByRole('textbox')
    const namaInput = inputs[0]
    namaInput.focus()
    expect(document.activeElement).toBe(namaInput)

    await user.type(namaInput, 'Helm')

    // After typing, the same input should still be focused
    expect(document.activeElement).toBe(namaInput)
    expect((namaInput as HTMLInputElement).value).toBe('Helm')
  })

  it('flips row to display mode when ✓ is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Harness />)
    await user.click(screen.getByRole('button', { name: /Tambah/i }))

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'Sarung tangan')

    // Click the save (✓) icon button — first non-Tambah button in the row
    const allButtons = screen.getAllByRole('button')
    // Find the check button by SVG class — first button without text
    const saveBtn = allButtons.find(
      (b) => !b.textContent?.includes('Tambah') && b.querySelector('svg.lucide-check'),
    )
    expect(saveBtn).toBeDefined()
    await user.click(saveBtn!)

    // Now the input should be replaced by display text
    expect(screen.getByText('Sarung tangan')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Sarung tangan')).not.toBeInTheDocument()
  })

  it('removes a row when trash button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <Harness
        initial={{
          ...emptyForm,
          ksu: [
            { id: 'k-1', namaItem: 'Helm', jumlah: 2, kondisi: 'BAIK', isSaved: true },
          ],
        }}
      />,
    )
    expect(screen.getByText('Helm')).toBeInTheDocument()

    const allButtons = screen.getAllByRole('button')
    const trashBtn = allButtons.find((b) =>
      b.querySelector('svg.lucide-trash, svg.lucide-trash-2'),
    )
    expect(trashBtn).toBeDefined()
    await user.click(trashBtn!)

    expect(screen.queryByText('Helm')).not.toBeInTheDocument()
    expect(screen.getByText(/Belum ada item KSU/i)).toBeInTheDocument()
  })

  it('flips row back to edit mode when pencil is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <Harness
        initial={{
          ...emptyForm,
          ksu: [
            { id: 'k-1', namaItem: 'Helm', jumlah: 2, kondisi: 'BAIK', isSaved: true },
          ],
        }}
      />,
    )

    const allButtons = screen.getAllByRole('button')
    const editBtn = allButtons.find((b) =>
      b.querySelector('svg.lucide-edit, svg.lucide-pencil, svg.lucide-square-pen'),
    )
    expect(editBtn).toBeDefined()
    await user.click(editBtn!)

    // After edit, an input with current value should appear
    const namaInput = await screen.findByDisplayValue('Helm')
    expect(namaInput).toBeInTheDocument()
  })

  it('keeps cells in adjacent rows stable when editing one row', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <Harness
        initial={{
          ...emptyForm,
          ksu: [
            { id: 'k-1', namaItem: 'Helm', jumlah: 2, kondisi: 'BAIK', isSaved: true },
            { id: 'k-2', namaItem: 'Jaket', jumlah: 1, kondisi: 'DAMAGE', isSaved: true },
          ],
        }}
      />,
    )

    // Both rows should be in display mode
    expect(screen.getByText('Helm')).toBeInTheDocument()
    expect(screen.getByText('Jaket')).toBeInTheDocument()

    // Click Tambah (adds a new editable row)
    await user.click(screen.getByRole('button', { name: /Tambah/i }))

    // Existing rows still in display mode (text, not input)
    expect(screen.getByText('Helm')).toBeInTheDocument()
    expect(screen.getByText('Jaket')).toBeInTheDocument()

    // The newly added row has an empty input
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThan(0)
    expect((inputs[0] as HTMLInputElement).value).toBe('')
  })
})

// Helper used above; keeps `within` import meaningful
void within
