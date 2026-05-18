import { useMemo, useState, useEffect, useRef } from "react";
import {
  useBranchData,
  useServiceData,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "./hooks";
import type { Service } from "./hooks";
import { SelectField, type SelectOption } from "@/components/ui/select";
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
import { FilterIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { FilterPopup, type FilterCriteria } from "./components/FilterPopup";
import { ServiceForm } from "./components/ServiceForm";
import type { ColumnDef } from "@tanstack/react-table";
import "./master-service.css";

export function MasterServiceScreen() {
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const hasAutoSelected = useRef(false);

  const { data: branches, isLoading: branchesLoading } = useBranchData();
  const { data: fetchedServices, isLoading: servicesLoading } = useServiceData(selectedBranchId);
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // Sync fetched services with local state
  useEffect(() => {
    if (fetchedServices) {
      setServices(fetchedServices);
    }
  }, [fetchedServices]);

  // Apply filters to services
  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter((service) => {
      if (
        filterCriteria.kodeJasa &&
        !service.kodeJasa
          .toLowerCase()
          .includes(filterCriteria.kodeJasa.toLowerCase())
      )
        return false;
      if (
        filterCriteria.namaJasa &&
        !service.namaJasa
          .toLowerCase()
          .includes(filterCriteria.namaJasa.toLowerCase())
      )
        return false;
      if (
        filterCriteria.servisCategory &&
        !service.servisCategory
          .toLowerCase()
          .includes(filterCriteria.servisCategory.toLowerCase())
      )
        return false;
      if (
        filterCriteria.namaVarian &&
        !service.namaVarian
          .toLowerCase()
          .includes(filterCriteria.namaVarian.toLowerCase())
      )
        return false;
      return true;
    });
  }, [services, filterCriteria]);

  // Auto-select first branch on load
  useEffect(() => {
    if (branches && branches.length > 0 && !hasAutoSelected.current) {
      setSelectedBranchId(branches[0].id);
      hasAutoSelected.current = true;
    }
  }, [branches]);

  // Branch select options
  const branchOptions: SelectOption[] = useMemo(
    () =>
      branches?.map((b) => ({
        value: b.id,
        label: `${b.kodeCabang} - ${b.namaCabang}`,
      })) || [],
    [branches],
  );

  // Table columns
  const columns: ColumnDef<Service>[] = useMemo(
    () => [
      {
        accessorKey: "kodeJasa",
        header: "Kode Jasa",
      },
      {
        accessorKey: "namaJasa",
        header: "Nama Jasa",
      },
      {
        accessorKey: "servisCategory",
        header: "Servis Category",
      },
      {
        accessorKey: "kodeHarian",
        header: "Kode Harian",
      },
      {
        accessorKey: "namaVarian",
        header: "Nama Varian",
      },
      {
        accessorKey: "kodeVarian",
        header: "Kode Varian",
      },
      {
        id: "actions",
        header: "Actions",
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
    setEditingService(null);
    setFormOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormOpen(true);
  };

  const handleDelete = (service: Service) => {
    setDeleteTarget(service);
  };

  const handleFormSubmit = async (formData: Omit<Service, "id">) => {
    if (editingService) {
      await updateMutation.mutateAsync({
        id: editingService.id,
        data: formData,
      });
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? { ...s, ...formData } : s,
        ),
      );
    } else {
      const result = await createMutation.mutateAsync(formData);
      if (result.data) {
        setServices((prev) => [...prev, result.data as Service]);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync();
    setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="master-service-container p-6">
      <div className="flex gap-2 mb-6 items-center justify-between">
        <SelectField
          label="Pilih Cabang"
          options={branchOptions}
          value={selectedBranchId}
          className="py-4 max-w-[250px]"
          onChange={setSelectedBranchId}
          placeholder="-- Pilih Cabang --"
          disabled={branchesLoading}
        />
        <div className="flex gap-2 mt-6">
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={handleCreateClick}
          >
            <PlusIcon className="size-4" />
            Create Service
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

      {/* Content Area */}
      {!selectedBranchId ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
          <p>Please select a branch to view services</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filteredServices}
            serverSide={false}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRows={filteredServices.length}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            isLoading={servicesLoading}
          />
          <FilterPopup
            open={filterOpen}
            onOpenChange={setFilterOpen}
            onApply={setFilterCriteria}
            onClear={() => setFilterCriteria({})}
          />
        </>
      )}

      {/* Service Form Modal */}
      <ServiceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingService || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete Service</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{deleteTarget?.namaJasa}"? This
            action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
