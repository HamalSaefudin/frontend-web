import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  useQueryMasterCoaList,
  useQueryMasterCoaDetail,
  useMutationCreateMasterCoa,
  useMutationUpdateMasterCoa,
  useMutationActivateMasterCoa,
  useMutationDeactivateMasterCoa,
  useMutationCopyMasterCoa,
  useMutationDeleteMasterCoa,
  useQueryCabang,
  type MasterCoa,
  type MasterCoaDetail,
} from './hooks';
import type {
  MasterCoaCreateFormData,
  MasterCoaUpdateFormData,
  CopyMasterCoaFormData,
} from './utils/validationSchemas';
import { DataTable } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
} from 'lucide-react';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import {
  MasterCoaForm,
  MasterCoaDetailDialog,
  MasterCoaCopyDialog,
} from './components';
import { COA_STATUS_OPTIONS } from './constants';
import type { ApiResponse, CreateMasterCoaRequest, UpdateMasterCoaRequest } from '@/services/master-coa';
import { formatBranchCodes } from './utils/branchLabelMap';
import { Switch } from '@/components/ui/switch';

interface MasterCoaRow extends MasterCoa {
  index: number;
}

type ConfirmAction = 'activate' | 'deactivate' | 'delete' | null;

function getApiErrorMessage<T>(result: ApiResponse<T>) {
  if (result.errors.length > 0) {
    return result.errors.map((e) => e.message).join(', ');
  }
  return result.message;
}

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
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

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

  const items = listResponse?.data?.items ?? [];
  const pagination = listResponse?.data?.pagination;
  const totalRows = pagination?.totalItems ?? 0;

  const tableData: MasterCoaRow[] = useMemo(
    () =>
      items.map((coa, idx) => ({
        ...coa,
        index: apiPage * rowsPerPage + idx + 1,
      })),
    [items, apiPage, rowsPerPage],
  );

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const openCreate = () => {
    setEditingCoa(null);
    setFormError('');
    setFormServerErrors([]);
    setFormOpen(true);
  };

  const openEdit = (coa: MasterCoa) => {
    setEditingCoa(coa);
    setFormError('');
    setFormServerErrors([]);
    setFormOpen(true);
    setDetailOpen(false);
  };

  const openDetail = (coa: MasterCoa) => {
    setDetailCoaId(coa.coaId);
    setDetailOpen(true);
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
    console.log('[MasterCoaScreen] handleFormSubmit called with data:', data);
    console.log('[MasterCoaScreen] editingCoa:', editingCoa);
    setFormError('');
    setFormServerErrors([]);

    if (editingCoa) {
      const { statusActive, transactions, ...rest } = data as MasterCoaUpdateFormData;
      const result = await updateMutation.mutateAsync({
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
      if (!result.success) {
        setFormError(getApiErrorMessage(result));
        setFormServerErrors(result.errors);
        throw new Error(result.message);
      }

      const wasActive = editingCoa.status === 'ACTIVE';
      if (statusActive !== wasActive) {
        const statusResult = statusActive
          ? await activateMutation.mutateAsync(editingCoa.coaId)
          : await deactivateMutation.mutateAsync(editingCoa.coaId);
        if (!statusResult.success) {
          setFormError(getApiErrorMessage(statusResult));
          throw new Error(statusResult.message);
        }
      }

      showFeedback('success', result.message);
      return;
    }

    const { statusActive, ...createPayload } = data as MasterCoaCreateFormData;
    const result = await createMutation.mutateAsync(createPayload as CreateMasterCoaRequest);
    if (!result.success) {
      setFormError(getApiErrorMessage(result));
      setFormServerErrors(result.errors);
      throw new Error(result.message);
    }

    const newCoaId = result.data?.coaId;
    if (newCoaId && !statusActive) {
      const deactivateResult = await deactivateMutation.mutateAsync(newCoaId);
      if (!deactivateResult.success) {
        setFormError(getApiErrorMessage(deactivateResult));
        throw new Error(deactivateResult.message);
      }
    }

    showFeedback('success', result.message);
  };

  const handleCopySubmit = async (data: CopyMasterCoaFormData) => {
    if (!copySource) return;
    setCopyError('');
    const result = await copyMutation.mutateAsync({ coaId: copySource.coaId, data });
    if (!result.success) {
      setCopyError(getApiErrorMessage(result));
      throw new Error(result.message);
    }
    showFeedback('success', result.message);
    setCopyOpen(false);
  };

  const handleConfirmAction = async () => {
    if (!confirmTarget || !confirmAction) return;

    let result: ApiResponse<unknown>;
    if (confirmAction === 'activate') {
      result = await activateMutation.mutateAsync(confirmTarget.coaId);
    } else if (confirmAction === 'deactivate') {
      result = await deactivateMutation.mutateAsync(confirmTarget.coaId);
    } else {
      result = await deleteMutation.mutateAsync(confirmTarget.coaId);
    }

    if (!result.success) {
      showFeedback('error', getApiErrorMessage(result));
    } else {
      showFeedback('success', result.message);
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

      {feedback && (
        <div
          className={`mb-4 rounded-md px-4 py-2 text-sm ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-destructive/10 text-destructive border border-destructive/30'
          }`}
        >
          {feedback.message}
        </div>
      )}

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
