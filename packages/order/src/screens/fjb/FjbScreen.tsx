import { InputField, SelectField, DataTable, DatePicker, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, Button } from "@frontend/ui"
import { useState } from "react";
import type { FjbListItem, FjbStatus } from "@frontend/shared";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { FilterIcon, PlusIcon } from "lucide-react";
import { FjbFormModal } from "./components/FjbFormModal";
import {
  useQueryFjbList,
  useMutationDeleteFjb,
  useQueryMasterCabang,
} from "./hooks/useFjb";

const STATUS_COLORS: Record<FjbStatus, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  DELETED: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<FjbStatus, string> = {
  DRAFT: "Draft",
  COMPLETED: "Completed",
  DELETED: "Deleted",
};

export function FjbScreen() {
  const [filters, setFilters] = useState({
    cabangId: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFjb, setSelectedFjb] = useState<FjbListItem | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: fjbList = [], isLoading } = useQueryFjbList({
    cabangId: filters.cabangId || undefined,
    startDate: filters.startDate?.toISOString().split("T")[0],
    endDate: filters.endDate?.toISOString().split("T")[0],
    search: filters.search || undefined,
  });

  const { data: masterCabang = [] } = useQueryMasterCabang();

  const deleteMutation = useMutationDeleteFjb();

  const handleAddNew = () => {
    setSelectedFjb(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (fjb: FjbListItem) => {
    setSelectedFjb(fjb);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (fjb: FjbListItem) => {
    setSelectedFjb(fjb);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (fjb: FjbListItem) => {
    setDeleteId(fjb.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const columns: ColumnDef<FjbListItem>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "tanggalFjb",
      header: "Tanggal FJB",
      cell: ({ getValue }) =>
        dayjs(getValue<string>()).format("DD MMM YYYY"),
    },
    { accessorKey: "noFjb", header: "No FJB" },
    { accessorKey: "noPolisi", header: "No Polisi" },
    { accessorKey: "namaPemilik", header: "Nama Pemilik" },
    { accessorKey: "namaPembawa", header: "Nama Pembawa" },
    { accessorKey: "noMesin", header: "No Mesin" },
    { accessorKey: "noRangka", header: "No Rangka" },
    { accessorKey: "kodeVarian", header: "Kode Varian" },
    { accessorKey: "kodeWarna", header: "Kode Warna" },
    { accessorKey: "namaWarna", header: "Nama Warna" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<FjbStatus>();
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}
          >
            {STATUS_LABELS[status]}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(row.original)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
          >
            Delete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
          >
            Print
          </Button>
        </div>
      ),
    },
  ];

  const handleStartDateChange = (date: Date | undefined) => {
    setFilters(prev => ({ ...prev, startDate: date ?? null }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setFilters(prev => ({ ...prev, endDate: date ?? null }));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Faktur Jual Bengkel</h1>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="w-48">
          <SelectField
            label="Cabang"
            value={filters.cabangId || undefined}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, cabangId: value || "" }))
            }
            options={masterCabang}
            placeholder="Pilih Cabang"
          />
        </div>
        <div className="w-40">
          <DatePicker
            label="Tanggal Awal"
            value={filters.startDate ?? undefined}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="w-40">
          <DatePicker
            label="Tanggal Akhir"
            value={filters.endDate ?? undefined}
            onChange={handleEndDateChange}
          />
        </div>
        <div className="flex-1 min-w-64">
          <InputField
            label="Search"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Nama Customer / No Polisi"
          />
        </div>
        <Button>
          <FilterIcon className="size-4 mr-2" />
          Cari
        </Button>
      </div>

      {/* Table Section */}
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <PlusIcon className="size-4 mr-2" />
          Tambah Data
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={fjbList}
        isLoading={isLoading}
        serverSide={false}
      />

      {/* Form Modal */}
      <FjbFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        initialData={selectedFjb ?? undefined}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Hapus FJB</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus FJB ini? Tindakan ini tidak dapat
            dibatalkan.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Hapus
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}