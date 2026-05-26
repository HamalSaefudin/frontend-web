import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useQueryMasterKasList,
  useMutationCreateMasterKas,
  useMutationUpdateMasterKas,
  useMutationDeleteMasterKas,
  useMutationUpdateMasterKasStatus,
  useMutationExportMasterKas,
  type MasterKas,
  type MasterKasFilters,
} from "./hooks";
import { DataTable } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { PlusIcon, EditIcon, TrashIcon, FilterIcon, PrinterIcon } from "lucide-react";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { MasterKasFormModal, MasterKasFilterPopup } from "./components";

// Table row with index for display
interface MasterKasRow extends MasterKas {
  index: number;
}

export function MasterKasScreen() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<MasterKasFilters>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editingKas, setEditingKas] = useState<MasterKas | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MasterKas | null>(null);

  // Build filters from search and filter criteria
  const filters: MasterKasFilters = useMemo(
    () => ({
      page,
      limit: rowsPerPage,
      namaKas: searchQuery || undefined,
      kodeKas: filterCriteria.kodeKas,
      cabangId: filterCriteria.cabangId,
      status: filterCriteria.status,
    }),
    [page, rowsPerPage, searchQuery, filterCriteria],
  );

  const { data, isLoading, isFetching } = useQueryMasterKasList(filters);
  const createMutation = useMutationCreateMasterKas();
  const updateMutation = useMutationUpdateMasterKas();
  const deleteMutation = useMutationDeleteMasterKas();
  const statusMutation = useMutationUpdateMasterKasStatus();
  const exportMutation = useMutationExportMasterKas();

  // Build table data with index
  const tableData: MasterKasRow[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((kas, idx) => ({
      ...kas,
      index: (page - 1) * rowsPerPage + idx + 1,
    }));
  }, [data, page, rowsPerPage]);

  // Table columns
  const columns: ColumnDef<MasterKasRow>[] = useMemo(
    () => [
      {
        accessorKey: "index",
        header: "No",
        cell: ({ getValue }) => (
          <span className="text-center">{getValue() as number}</span>
        ),
        meta: { className: "min-w-16 text-center" },
      },
      {
        accessorKey: "kodeKas",
        header: "Kode Kas",
        meta: { className: "min-w-24" },
      },
      {
        accessorKey: "namaCabang",
        header: "Nama Cabrera",
        meta: { className: "min-w-32" },
      },
      {
        accessorKey: "namaKas",
        header: "Nama Kas",
        meta: { className: "min-w-32" },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Switch
              checked={row.original.status}
              onCheckedChange={(checked) =>
                handleStatusToggle(row.original.id, checked)
              }
              disabled={statusMutation.isPending}
            />
          </div>
        ),
        meta: { className: "min-w-20 text-center" },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleEdit(row.original)}
              className="text-primary hover:text-primary/80 transition-colors p-1"
              title="Edit"
            >
              <EditIcon className="size-4" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="text-destructive hover:text-destructive/80 transition-colors p-1"
              title="Delete"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        ),
        meta: { className: "min-w-24 text-center" },
      },
    ],
    [statusMutation.isPending],
  );

  // Handlers
  const handleCreateClick = () => {
    setEditingKas(null);
    setFormOpen(true);
  };

  const handleEdit = (kas: MasterKas) => {
    setEditingKas(kas);
    setFormOpen(true);
  };

  const handleDelete = (kas: MasterKas) => {
    setDeleteTarget(kas);
  };

  const handleStatusToggle = async (id: string, status: boolean) => {
    try {
      await statusMutation.mutateAsync({ id, status });
    } catch {
      // Error handled by mutation
    }
  };

  const handleFormSubmit = async (
    kasData: Omit<MasterKas, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      if (editingKas) {
        await updateMutation.mutateAsync({
          id: editingKas.id,
          data: kasData,
        });
      } else {
        await createMutation.mutateAsync(kasData);
      }
    } catch {
      // Error handled by parent
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleFilterApply = (criteria: MasterKasFilters) => {
    setFilterCriteria(criteria);
    setPage(1); // Reset to first page on filter change
  };

  const handleFilterClear = () => {
    setFilterCriteria({});
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page on search
  };

  const handleExport = async () => {
    try {
      const response = await exportMutation.mutateAsync({
        filters,
        format: "excel",
      });
      const blob = response?.data?.data;
      if (!blob) return;
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `master-kas-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Error handled by mutation
    }
  };

  const isLoadingOverall = isLoading || isFetching;

  return (
    <div className="master-kas-container p-6">
      <h1 className="text-2xl font-bold mb-6">Master Kas</h1>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Cari nama kas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button variant="default" size="sm" onClick={handleSearch}>
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
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            <PrinterIcon className="size-4" />
            Cetak
          </Button>
        </div>
      </div>

      {/* Data Table */}
      {isLoadingOverall ? (
        <LoadingOverlay
          message={isFetching ? "Memperbarui data..." : "Memuat data..."}
        />
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          serverSide={true}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          totalRows={data?.total || 0}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onRowsPerPageChange={setRowsPerPage}
          isLoading={false}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Hapus Data Kas</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus "{deleteTarget?.namaKas}"? Tindakan
            ini tidak dapat dibatalkan.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filter Popup */}
      <MasterKasFilterPopup
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      {/* Form Modal */}
      <MasterKasFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingKas || undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}