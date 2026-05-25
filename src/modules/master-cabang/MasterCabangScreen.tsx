import { useMemo, useState, useEffect } from 'react';
import {
  useQueryCabang,
  useMutationCreateCabang,
  useMutationUpdateCabang,
  useMutationDeleteCabang,
  useMutationImportCabang,
  type Branch,
} from './hooks';
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
import { FilterIcon, PlusIcon, EditIcon, TrashIcon, UploadIcon } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { filterBranches, type BranchFilterCriteria } from './utils/filterBranches';
import { FilterPopup, BranchForm } from './components';
import { UploadDocumentModal } from '@/components/ui/upload-document-modal';
import './master-cabang.css';

export function MasterCabangScreen() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<BranchFilterCriteria>({});
  const [formOpen, setFormOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  const { data: fetchedBranches, isLoading } = useQueryCabang();
  const createMutation = useMutationCreateCabang();
  const updateMutation = useMutationUpdateCabang();
  const deleteMutation = useMutationDeleteCabang();
  const importMutation = useMutationImportCabang();

  // Sync fetched branches with local state
  useEffect(() => {
    if (fetchedBranches) {
      setBranches(fetchedBranches);
    }
  }, [fetchedBranches]);

  // Apply filters to branches
  const filteredBranches = useMemo(() => {
    if (!branches) return [];
    return filterBranches(branches, filterCriteria);
  }, [branches, filterCriteria]);

  // Table columns
  const columns: ColumnDef<Branch>[] = useMemo(
    () => [
      {
        accessorKey: 'kodeCabang',
        header: 'Kode Cabang',
      },
      {
        accessorKey: 'namaCabang',
        header: 'Nama Cabang',
      },
      {
        accessorKey: 'namaLead',
        header: 'Nama Leader',
      },
      {
        id: 'actions',
        header: 'Actions',
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
      },
    ],
    [],
  );

  const handleCreateClick = () => {
    setEditingBranch(null);
    setFormOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormOpen(true);
  };

  const handleDelete = (branch: Branch) => {
    setDeleteTarget(branch);
  };

  const handleFormSubmit = async (formData: Omit<Branch, 'id'>) => {
    if (editingBranch) {
      await updateMutation.mutateAsync({
        id: editingBranch.id,
        data: formData,
      });
      setBranches((prev) =>
        prev.map((b) =>
          b.id === editingBranch.id ? { ...b, ...formData } : b,
        ),
      );
    } else {
      await createMutation.mutateAsync(formData);
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setBranches((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleImportFile = async (file: File) => {
    try {
      const result = await importMutation.mutateAsync(file);
      if (result.data.success) {
        // Refresh the branches list after import
        // Note: In a real app, you'd call a refetch function from the useQuery hook
        return {
          success: true,
          message: `Import successful: branches imported`,
        };
      }
      return {
        success: false,
        message: result.data.message || 'Import failed',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Import failed',
      };
    }
  };

  return (
    <div className="master-cabang-container p-6">
      <div className="flex gap-2 mb-6 items-center justify-between">
        <h1 className="text-2xl font-bold">Master Cabang</h1>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={handleCreateClick}
          >
            <PlusIcon className="size-4" />
            Create Branch
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
            onClick={() => setUploadOpen(true)}
          >
            <UploadIcon className="size-4" />
            Import
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredBranches}
        serverSide={false}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={filteredBranches.length}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete Branch</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{deleteTarget?.namaCabang}"? This
            action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filter Popup */}
      <FilterPopup
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApply={setFilterCriteria}
        onClear={() => setFilterCriteria({})}
      />

      {/* Branch Form Modal */}
      <BranchForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingBranch || undefined}
      />

      {/* Upload Document Modal */}
      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        title="Import Branches"
        description="Drag and drop your Excel file here, or click to select"
        onUpload={handleImportFile}
        acceptedFormats={['.xlsx', '.xls']}
        maxFileSize={10 * 1024 * 1024}
      />
    </div>
  );
}
