import { LoadingOverlay } from '@/components/LoadingOverlay';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/ui/table';
import type { CreateMasterCoaRequest, UpdateMasterCoaRequest } from '@/services/master-coa';
import type { ColumnDef } from '@tanstack/react-table';
import {
  CopyIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  MasterCoaCopyDialog,
  MasterCoaDetailDialog,
  MasterCoaForm,
} from './components';
import { COA_STATUS_OPTIONS } from './constants';
import {
  useMutationActivateMasterCoa,
  useMutationCopyMasterCoa,
  useMutationCreateMasterCoa,
  useMutationDeactivateMasterCoa,
  useMutationDeleteMasterCoa,
  useMutationUpdateMasterCoa,
  useQueryCabang,
  useQueryMasterCoaList,
  type MasterCoa
} from './hooks';
import { formatBranchCodes } from './utils/branchLabelMap';
import type {
  CopyMasterCoaFormData,
  MasterCoaCreateFormData,
  MasterCoaUpdateFormData,
} from './utils/validationSchemas';

interface MasterCoaRow extends MasterCoa {
  index: number;
}

type ConfirmAction = 'activate' | 'deactivate' | 'delete' | null;

export function MasterCoaScreen() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingCoa, setEditingCoa] = useState<MasterCoa | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailCoaId, setDetailCoaId] = useState<string | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [copySource, setCopySource] = useState<MasterCoa | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<MasterCoa | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [formError, setFormError] = useState('');
  const [formServerErrors, setFormServerErrors] = useState<{ field: string; message: string }[]>(
    [],
  );
  const [copyError, setCopyError] = useState('');

  const apiPage = page - 1;
  const { data: listResponse, isLoading, isFetching } = useQueryMasterCoaList(
    searchKeyword,
    statusFilter,
    apiPage,
    rowsPerPage,
  );

  const createMutation = useMutationCreateMasterCoa();
  const updateMutation = useMutationUpdateMasterCoa();
  const activateMutation = useMutationActivateMasterCoa();
  const deactivateMutation = useMutationDeactivateMasterCoa();
  const copyMutation = useMutationCopyMasterCoa();
  const deleteMutation = useMutationDeleteMasterCoa();

  const { data: cabangList = [] } = useQueryCabang();

  const items = useMemo(() => listResponse?.items ?? [], [listResponse]);
  const pagination = listResponse?.pagination;
  const totalRows = pagination?.totalItems ?? 0;

  const tableData: MasterCoaRow[] = useMemo(
    () =>
      items.map((coa, idx) => ({
        ...coa,
        index: apiPage * rowsPerPage + idx + 1,
      })),
    [items, apiPage, rowsPerPage],
  );

  const openCreate = () => {
    setEditingCoa(null);
    setFormError('');
    setFormServerErrors([]);
    setFormOpen(true);
  };

  const openEdit = (coa: MasterCoa) => {
    setEditingCoa(coa);
    setDetailCoaId(coa.coaId);
    setFormError('');
    setFormServerErrors([]);
    setFormOpen(true);
    setDetailOpen(false);
  };

  const openCopy = (coa: MasterCoa) => {
    setCopySource(coa);
    setCopyError('');
    setCopyOpen(true);
    setDetailOpen(false);
  };

  const openConfirm = (coa: MasterCoa, action: ConfirmAction) => {
    setConfirmTarget(coa);
    setConfirmAction(action);
  };

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPage(1);
  };

  const handleFormSubmit = async (data: MasterCoaCreateFormData | MasterCoaUpdateFormData) => {
    if (editingCoa) {
      const { statusActive, transactions, ...rest } = data as MasterCoaUpdateFormData;
      await updateMutation.mutateAsync({
        coaId: editingCoa.coaId,
        data: {
          coaName: rest.coaName,
          branches: rest.branches,
          transactions: (transactions || []).map((t) => ({
            transactionName: t.transactionName,
            category: t.category,
            subgroup: t.subgroup || undefined,
            group: t.group || undefined,
          })),
        } satisfies UpdateMasterCoaRequest,
      });

      const wasActive = editingCoa.status === 'ACTIVE';
      if (statusActive !== wasActive) {
        if (statusActive) {
          await activateMutation.mutateAsync(editingCoa.coaId);
        } else {
          await deactivateMutation.mutateAsync(editingCoa.coaId);
        }
      }
      return;
    }

    const createPayload = data as CreateMasterCoaRequest;
    await createMutation.mutateAsync(createPayload);
  };

  const handleCopySubmit = async (_data: CopyMasterCoaFormData) => {
    if (!copySource) return;
    await copyMutation.mutateAsync({ coaId: copySource.coaId, data: _data });
    setCopyOpen(false);
  };

  const handleConfirmAction = async () => {
    if (!confirmTarget || !confirmAction) return;

    if (confirmAction === 'activate') {
      await activateMutation.mutateAsync(confirmTarget.coaId);
    } else if (confirmAction === 'deactivate') {
      await deactivateMutation.mutateAsync(confirmTarget.coaId);
    } else {
      await deleteMutation.mutateAsync(confirmTarget.coaId);
    }

    setConfirmTarget(null);
    setConfirmAction(null);
    setDetailOpen(false);
  };

  const handleStatusToggle = async (coaId: string, checked: boolean) => {
    try {
      if (checked) {
        await activateMutation.mutateAsync(coaId);
      } else {
        await deactivateMutation.mutateAsync(coaId);
      }
    } catch {
      // Error handled by mutation
    }
  };

  const columns: ColumnDef<MasterCoaRow>[] = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: 'No',
        cell: ({ getValue }) => <span className="text-center">{getValue() as number}</span>,
        meta: { className: 'min-w-12 text-center' },
      },
      { accessorKey: 'coaId', header: 'ID COA', meta: { className: 'min-w-24' } },
      { accessorKey: 'coaName', header: 'Nama COA', meta: { className: 'min-w-40' } },
      {
        id: 'branches',
        header: 'Cabang',
        cell: ({ row }) => formatBranchCodes(row.original.branches, cabangList),
        meta: { className: 'min-w-48' },
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            {/* Switch untuk aktif/nonaktif */}
            <Switch
              checked={row.original.status === 'ACTIVE'}
              onCheckedChange={(checked) => handleStatusToggle(row.original.coaId, checked)}
              disabled={activateMutation.isPending || deactivateMutation.isPending}
            />
            {/* Edit */}
            <button
              type="button"
              onClick={() => openEdit(row.original)}
              className="text-primary hover:text-primary/80 p-1"
              title="Edit"
            >
              <EditIcon className="size-4" />
            </button>
            {/* Copy */}
            <button
              type="button"
              onClick={() => openCopy(row.original)}
              className="text-muted-foreground hover:text-foreground p-1"
              title="Salin"
            >
              <CopyIcon className="size-4" />
            </button>
            {/* Delete */}
            <button
              type="button"
              onClick={() => openConfirm(row.original, 'delete')}
              className="text-destructive hover:text-destructive/80 p-1"
              title="Hapus"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        ),
        meta: { className: 'min-w-40 text-center' },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cabangList, activateMutation.isPending, deactivateMutation.isPending],
  );

  const confirmTitle =
    confirmAction === 'activate'
      ? 'Aktifkan COA'
      : confirmAction === 'deactivate'
        ? 'Nonaktifkan COA'
        : 'Hapus COA';

  const confirmDescription =
    confirmAction === 'activate'
      ? `Aktifkan "${confirmTarget?.coaName}"?`
      : confirmAction === 'deactivate'
        ? `Nonaktifkan "${confirmTarget?.coaName}"? COA tidak dapat dipakai untuk transaksi baru.`
        : `Hapus "${confirmTarget?.coaName}"? Tindakan ini tidak dapat dibatalkan.`;

  const isLoadingOverall = isLoading || isFetching;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Master COA</h1>

      <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Cari nama COA..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button variant="default" size="sm" onClick={handleSearch}>
            Cari
          </Button>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {COA_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Button variant="default" size="sm" className="gap-2" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Tambah
        </Button>
      </div>

      {isLoadingOverall ? (
        <LoadingOverlay message={isFetching ? 'Memperbarui data...' : 'Memuat data...'} />
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          serverSide
          page={apiPage}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onRowsPerPageChange={(size) => {
            setRowsPerPage(size);
            setPage(1);
          }}
          isLoading={false}
        />
      )}

      <AlertDialog
        open={!!confirmTarget && !!confirmAction}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmTarget(null);
            setConfirmAction(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmAction === 'delete'
                  ? 'bg-destructive text-white hover:bg-destructive/90'
                  : undefined
              }
            >
              {confirmAction === 'delete' ? 'Hapus' : 'Ya'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <MasterCoaForm
        key={editingCoa?.coaId ?? 'create'}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingCoa}
        isLoading={
          createMutation.isPending ||
          updateMutation.isPending ||
          activateMutation.isPending ||
          deactivateMutation.isPending
        }
        serverErrors={formServerErrors}
        errorMessage={formError}
      />

      <MasterCoaDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        coaId={detailCoaId}
        onEdit={() => {
          const coa = items.find((c) => c.coaId === detailCoaId);
          if (coa) openEdit(coa);
        }}
        onActivate={() => {
          const coa = items.find((c) => c.coaId === detailCoaId);
          if (coa) openConfirm(coa, 'activate');
        }}
        onDeactivate={() => {
          const coa = items.find((c) => c.coaId === detailCoaId);
          if (coa) openConfirm(coa, 'deactivate');
        }}
        onDelete={() => {
          const coa = items.find((c) => c.coaId === detailCoaId);
          if (coa) openConfirm(coa, 'delete');
        }}
      />

      <MasterCoaCopyDialog
        open={copyOpen}
        onOpenChange={setCopyOpen}
        source={copySource}
        onSubmit={handleCopySubmit}
        isLoading={copyMutation.isPending}
        errorMessage={copyError}
      />
    </div>
  );
}
