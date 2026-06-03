import { LoadingOverlay, Card, Container, Page, Section, Progress, DataTable, SelectField } from '@frontend/ui'
import type { Report, User } from '@frontend/shared/types/index.ts'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useLoadDashboard } from './hooks'
import './dashboard.css'

const userColumns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
]

const reportColumns: ColumnDef<Report>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'author', header: 'Author' },
  { accessorKey: 'status', header: 'Status' },
]

export function DashboardScreen() {
  const { isLoading, data } = useLoadDashboard()
  const [roleFilter, setRoleFilter] = useState('')

  if (isLoading) {
    return <LoadingOverlay message="Loading dashboard data..." />
  }

  const roleOptions = [
    ...new Map(data.users.map((u) => [u.role, { value: u.role, label: u.role }])).values(),
  ]

  const filteredUsers = roleFilter
    ? data.users.filter((u) => u.role === roleFilter)
    : data.users

  return (
    <Page>
      <Container maxWidth="xl">
        <Section title="Statistics">
          <div className="stats-grid">
            <Card variant="elevated">
              <div className="stat">
                <span className="stat__label">Total Leads</span>
                <span className="stat__value">{data.stats.totalLeads}</span>
              </div>
            </Card>
            <Card variant="elevated">
              <div className="stat">
                <span className="stat__label">Converted</span>
                <span className="stat__value">{data.stats.convertedLeads}</span>
              </div>
            </Card>
            <Card variant="elevated">
              <div className="stat">
                <span className="stat__label">Pending</span>
                <span className="stat__value">{data.stats.pendingLeads}</span>
              </div>
            </Card>
            <Card variant="elevated">
              <div className="stat">
                <span className="stat__label">Conversion Rate</span>
                <span className="stat__value">{data.stats.conversionRate}%</span>
                <Progress value={data.stats.conversionRate} size="sm" color="brand" className="mt-3" />
              </div>
            </Card>
          </div>
        </Section>

        <Section title="Users">
          <div className="mb-4 max-w-xs">
            <SelectField
              label="Filter by Role"
              placeholder="All roles"
              options={roleOptions}
              clearable
              value={roleFilter}
              onChange={(val) => setRoleFilter(val === roleFilter ? '' : val)}
            />
          </div>
          <DataTable columns={userColumns} data={filteredUsers} />
        </Section>

        <Section title="Reports">
          <DataTable columns={reportColumns} data={data.reports} />
        </Section>

        <Section title="Settings">
          <Card>
            <div className="settings-list">
              <div className="setting-row">
                <span>Theme:</span>
                <span className="setting-value">{data.settings.theme}</span>
              </div>
              <div className="setting-row">
                <span>Notifications:</span>
                <span className="setting-value">
                  {data.settings.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="setting-row">
                <span>Language:</span>
                <span className="setting-value">{data.settings.language}</span>
              </div>
              <div className="setting-row">
                <span>Timezone:</span>
                <span className="setting-value">{data.settings.timezone}</span>
              </div>
            </div>
          </Card>
        </Section>
      </Container>
    </Page>
  )
}
