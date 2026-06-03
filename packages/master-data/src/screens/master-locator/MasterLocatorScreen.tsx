import { Button, InputField, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, LoadingOverlay, DataTable, Switch } from '@frontend/ui'
import { useCallback, useState, useMemo, useEffect } from 'react';
import { PlusIcon, FilterIcon, EditIcon, SearchIcon } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { FilterPopup, LokasiFormModal } from './components';
import {
  useLokasiList,
  useMutationCreateLokasi,
  useMutationUpdateLokasi,
  useMutationDeleteLokasi,
  useMutationUpdateLokasiStatus,
  type LokasiWarehouse,
  type LokasiFilterInput,
} from './hooks';

const DUMMY_CABANG_OPTIONS = [
  { id: '1', kodeCabang: 'JKT01', namaCabang: 'Jakarta' },
  { id: '2', kodeCabang: 'SBY01', namaCabang: 'Surabaya' },
  { id: '3', kodeCabang: 'BDG01', namaCabang: 'Bandung' },
  { id: '4', kodeCabang: 'MDN01', namaCabang: 'Medan' },
  { id: '5', kodeCabang: 'YOG01', namaCabang: 'Yogyakarta' },
];

function getCabangName(kodeCabang: string): string {
  const cabang = DUMMY_CABANG_OPTIONS.find(c => c.kodeCabang === kodeCabang);
  return cabang ? `${kodeCabang} - ${cabang.namaCabang}` : kodeCabang;
}

export function MasterLocatorScreen() {
  // Pagination: page is 0-based for DataTable, API uses 1-based (page+1)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<LokasiFilterInput>({});
  const [inlineSearch, setInlineSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingLokasi, setEditingLokasi] = useState<LokasiWarehouse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LokasiWarehouse | null>(null);
  const [lokasiList, setLokasiList] = useState<LokasiWarehouse[]>([]);
  const [totalElements, setTotalElements] = useState(0);

  // Build query params with pagination (API uses 1-based page)
  const queryParams = {
    ...filterCriteria,
    page: page + 1,  // Convert 0-based to 1-based
    size: rowsPerPage,
  };

  const { data: fetchedData, isLoading, isFetching } = useLokasiList(queryParams);
  const createMutation = useMutationCreateLokasi();
  const updateMutation = useMutationUpdateLokasi();
  const deleteMutation = useMutationDeleteLokasi();
  const statusMutation = useMutationUpdateLokasiStatus();

  // Reset to default pagination and clear filters
  const resetToDefault = () => {
    setPage(0);
    setRowsPerPage(5);
    setFilterCriteria({});
    setInlineSearch('');
  };

  // Sync fetched data with local state
  useEffect(() => {
    if (fetchedData?.data.data?.items) {
      setLokasiList(fetchedData.data.data.items);
      setTotalElements(fetchedData.data.data.totalElements || 0);
    }
  }, [fetchedData]);

  const handleCreateClick = useCallback(() => {
    setEditingLokasi(null);
    setFormOpen(true);
  }, []);

  const handleViewEdit = useCallback((lokasi: LokasiWarehouse) => {
    setEditingLokasi(lokasi);
    setFormOpen(true);
  }, []);

  const handleToggleStatus = useCallback(async (lokasi: LokasiWarehouse) => {
    const newStatus = lokasi.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await statusMutation.mutateAsync({ id: lokasi.id, status: newStatus });
      resetToDefault();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }, [statusMutation]);

  // Table columns - recalculate when page or rowsPerPage changes
  const columns: ColumnDef<LokasiWarehouse>[] = useMemo(
    () => [
      {
        id: 'no',
        header: 'No',
        cell: ({ row }) => page * rowsPerPage + row.index + 1,
        meta: { className: 'min-w-12 text-center' },
      },
      {
        accessorKey: 'kodeLokasi',
        header: 'Kode Lokasi',
        meta: { className: 'min-w-32' },
      },
      {
        id: 'kodeCabang',
        header: 'Kode Cabrera',
        cell: ({ row }) => getCabangName(row.original.kodeCabang),
        meta: { className: 'min-w-40' },
      },
      {
        accessorKey: 'namaLokasi',
        header: 'Nama Lokasi',
        meta: { className: 'min-w-48' },
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
          <div className="flex gap-1 justify-center items-center">
            <button
              onClick={() => handleViewEdit(row.original)}
              className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
              title="Lihat/Ubah"
            >
              <EditIcon className="size-4" />
            </button>
            <Switch
              checked={row.original.status === 'ACTIVE'}
              onCheckedChange={() => handleToggleStatus(row.original)}
              size="sm"
            />
          </div>
        ),
        meta: { className: 'min-w-24 text-center' },
      },
    ],
    [page, rowsPerPage, handleViewEdit, handleToggleStatus],
  );

  const handleFormSubmit = async (formData: Omit<LokasiWarehouse, 'id'>) => {
    if (editingLokasi) {
      await updateMutation.mutateAsync({
        id: editingLokasi.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setFormOpen(false);
    resetToDefault(); // Reset filter and pagination after create/update
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteMutation.mutateAsync(deleteTarget.id);
    if (result.data.success) {
      setLokasiList((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      resetToDefault(); // Reset filter and pagination after delete
    }
    setDeleteTarget(null);
  };

  // Inline search handler - clears filter popup when used
  const handleInlineSearch = () => {
    if (inlineSearch.trim()) {
      // Clear filter popup criteria and use inline search - API handles partial matching
      setFilterCriteria({ kodeLokasi: inlineSearch.trim() });
    } else {
      setFilterCriteria({});
    }
  };

  // Filter popup apply - clears inline search when used
  const handleFilterApply = (filters: LokasiFilterInput) => {
    // Clear inline search when using filter popup
    setInlineSearch('');
    setFilterCriteria(filters);
  };

  const handleFilterClear = () => {
    setFilterCriteria({});
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    // Page change: keep filters and rowsPerPage
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newSize: number) => {
    // Rows per page change: reset to page 0 and clear all filters
    setPage(0);
    setRowsPerPage(newSize);
    setFilterCriteria({});
    setInlineSearch('');
  };

  const isLoadingOverall = isLoading || isFetching;

  return (
    <div className="p-6">
      {/* Title - full width */}
      <h1 className="text-2xl font-bold mb-4">Master Lokasi Warehouse</h1>

      {/* Toolbar row - search left, buttons right */}
      <div className="flex gap-2 mb-4 items-center justify-between">
        <div className="flex gap-2">
          <div className="w-64">
            <InputField
              value={inlineSearch}
              onChange={(e) => setInlineSearch(e.target.value)}
              placeholder="Cari Kode Lokasi..."
            />
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleInlineSearch}
            className="gap-2"
          >
            <SearchIcon className="size-4" />
            Cari
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={handleCreateClick}
          >
            <PlusIcon className="size-4" />
            Tambah
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setFilterOpen(true)}
          >
            <FilterIcon className="size-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Data Table */}
      {isLoadingOverall ? (
        <LoadingOverlay
          message={isFetching ? 'Memperbarui data...' : 'Memuat data...'}
        />
      ) : (
        <DataTable
          columns={columns}
          data={lokasiList}
          serverSide={true}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalElements}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          isLoading={false}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Hapus Lokasi Warehouse</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus lokasi "{deleteTarget?.namaLokasi}"? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end mt-4">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filter Popup */}
      <FilterPopup
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      {/* Create/Edit Form Modal */}
      <LokasiFormModal
        mode={editingLokasi ? 'edit' : 'create'}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingLokasi || undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
