import { AppModal } from '@/components/AppModal'
import { Container, Page, Section } from '@/components/layouts'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { InputField } from '@/components/ui/input-field'
import { SelectField } from '@/components/ui/select'
import { DataTable } from '@/components/ui/table'
import type { Lead } from '@/types'
import type { CellContext, ColumnDef, HeaderContext } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useLeadsQuery } from './hooks'
import './leads.css'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
]

function SortableHeader({ label, column }: { label: string; column: HeaderContext<Lead, unknown>['column'] }) {
  const sorted = column.getIsSorted()
  return (
    <button
      onClick={() => column.toggleSorting(sorted === 'asc')}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      <span className="text-[10px]">{sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}</span>
    </button>
  )
}

function createLeadColumns(onEdit: (lead: Lead) => void): ColumnDef<Lead>[] {
  return [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }: CellContext<Lead, unknown>) => (
        <span className="text-muted-foreground tabular-nums">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }: HeaderContext<Lead, unknown>) => (
        <SortableHeader label="Name" column={column} />
      ),
      cell: ({ row }: CellContext<Lead, unknown>) => (
        <span className="font-medium text-foreground">{row.getValue('name')}</span>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }: CellContext<Lead, unknown>) => {
        const { email, phone } = row.original
        return (
          <div className="flex flex-col gap-0.5">
            <span>{email}</span>
            <span className="text-xs text-muted-foreground">{phone}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'company',
      header: ({ column }: HeaderContext<Lead, unknown>) => (
        <SortableHeader label="Company" column={column} />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: CellContext<Lead, unknown>) => {
        const status = row.getValue<string>('status')
        return <span className={`status-badge status-badge--${status}`}>{status}</span>
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }: HeaderContext<Lead, unknown>) => (
        <SortableHeader label="Created" column={column} />
      ),
      cell: ({ row }: CellContext<Lead, unknown>) => {
        const date = new Date(row.getValue<string>('createdAt'))
        return (
          <span className="text-muted-foreground text-xs">
            {date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: CellContext<Lead, unknown>) => (
        <button
          className="text-xs text-primary hover:underline"
          onClick={() => onEdit(row.original)}
        >
          Edit
        </button>
      ),
    },
  ]
}

export function LeadsScreen() {
  const { data: leads, isPending } = useLeadsQuery()
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [form, setForm] = useState<Lead | null>(null)
  const [filterFrom, setFilterFrom] = useState<Date | undefined>()
  const [filterTo, setFilterTo] = useState<Date | undefined>()

  const openEdit = (lead: Lead) => {
    setEditingLead(lead)
    setForm({ ...lead })
  }

  const closeEdit = () => {
    setEditingLead(null)
    setForm(null)
  }

  const handleSave = () => {
    // TODO: wire to update API mutation
    console.log('save', form)
    closeEdit()
  }

  const filteredLeads = useMemo(() => {
    return (leads ?? []).filter((lead) => {
      const date = new Date(lead.createdAt)
      if (filterFrom && date < filterFrom) return false
      if (filterTo) {
        const toEndOfDay = new Date(filterTo)
        toEndOfDay.setHours(23, 59, 59, 999)
        if (date > toEndOfDay) return false
      }
      return true
    })
  }, [leads, filterFrom, filterTo])

  const columns = createLeadColumns(openEdit)

  if (isPending) return <LoadingOverlay message="Loading leads..." />

  return (
    <Page>
      <Container maxWidth="xl">
        <Section>
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <DatePicker
              label="From"
              value={filterFrom}
              onChange={setFilterFrom}
              placeholder="Start date"
              className="w-48"
            />
            <DatePicker
              label="To"
              value={filterTo}
              onChange={setFilterTo}
              placeholder="End date"
              className="w-48"
            />
            {(filterFrom ?? filterTo) && (
              <Button
                variant="ghost"
                className="self-end"
                onClick={() => { setFilterFrom(undefined); setFilterTo(undefined) }}
              >
                Clear
              </Button>
            )}
          </div>
          <DataTable columns={columns} data={[...filteredLeads,...filteredLeads,...filteredLeads,...filteredLeads,...filteredLeads,...filteredLeads,...filteredLeads,...filteredLeads]} serverSide={false} />
        </Section>
      </Container>

      <AppModal
        isOpen={!!editingLead}
        onClose={closeEdit}
        className="w-[95vw] max-w-[95vw]"
        title={`Edit Lead — ${editingLead?.name ?? ''}`}
      >
        {form && (
          <div className="flex flex-col gap-4">
            <InputField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <InputField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <InputField
              label="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <SelectField
              mode="simple"
              label="Status"
              options={STATUS_OPTIONS}
              value={form.status ? STATUS_OPTIONS.find((o) => o.value === form.status) : undefined}
              onChange={(val) => setForm({ ...form, status: val?.value as Lead['status'] })}
            />
            <DatePicker
              label="Created At"
              value={form.createdAt ? new Date(form.createdAt) : undefined}
              onChange={(date) =>
                setForm({ ...form, createdAt: date ? date.toISOString() : form.createdAt })
              }
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeEdit}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        )}
      </AppModal>
    </Page>
  )
}
