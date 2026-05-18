import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/table'

interface Row { id: string; name: string }

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
]

const tenRows: Row[] = Array.from({ length: 10 }, (_, i) => ({
  id: `id-${i}`,
  name: `name-${i}`,
}))

describe('DataTable', () => {
  it('renders rows', () => {
    render(<DataTable columns={columns} data={tenRows.slice(0, 3)} serverSide={false} />)
    expect(screen.getByText('id-0')).toBeInTheDocument()
    expect(screen.getByText('name-2')).toBeInTheDocument()
  })

  it('shows empty state when no rows', () => {
    render(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('shows skeleton when loading', () => {
    const { container } = render(<DataTable columns={columns} data={[]} isLoading />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('client-side: paginates internally', async () => {
    render(<DataTable columns={columns} data={tenRows} serverSide={false} />)
    expect(screen.getByText('1–5 of 10')).toBeInTheDocument()
    await userEvent.click(screen.getByLabelText('Next page'))
    expect(screen.getByText('6–10 of 10')).toBeInTheDocument()
  })

  it('server-side: emits page change', async () => {
    const onPageChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={tenRows.slice(0, 5)}
        page={0}
        rowsPerPage={5}
        totalRows={10}
        onPageChange={onPageChange}
      />,
    )
    await userEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('previous button disabled on first page', () => {
    render(<DataTable columns={columns} data={tenRows} serverSide={false} />)
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('next button disabled on last page', async () => {
    render(<DataTable columns={columns} data={tenRows.slice(0, 3)} serverSide={false} />)
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })
})
