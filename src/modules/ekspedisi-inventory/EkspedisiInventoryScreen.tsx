import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";
import { DataTable } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ErrorFallback } from "@/components/ErrorFallback";
import { useQueryEkspedisiInventoryList } from "./hooks/useEkspedisiInventory";
import type {
  EkspedisiInventoryFilters,
  EkspedisiInventoryListItem,
} from "@/services/ekspedisi-inventory";
import { EKSPEDISI_INVENTORY_STATUS_OPTIONS } from "./constants/status-options";
import { EkspedisiInventoryModal } from "./components";
import type { EkspedisiInventoryStatus } from "@/services/ekspedisi-inventory";

const defaultFilters: EkspedisiInventoryFilters = {
  status: "",
  keyword: "",
};

export function EkspedisiInventoryScreen() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [draftFilters, setDraftFilters] =
    useState<EkspedisiInventoryFilters>(defaultFilters);
  const [activeFilters, setActiveFilters] =
    useState<EkspedisiInventoryFilters>(defaultFilters);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const listQuery = useQueryEkspedisiInventoryList(
    page + 1,
    rowsPerPage,
    activeFilters,
  );

  useEffect(() => {
    if (listQuery.isError) setSuccessMessage(null);
  }, [listQuery.isError]);

  const records = listQuery.data?.data.data?.data ?? [];

  const columns: ColumnDef<EkspedisiInventoryListItem>[] = useMemo(() => {
    return [
      {
        id: "no",
        header: "No",
        cell: ({ row }) => page * rowsPerPage + row.index + 1,
      },
      { accessorKey: "tanggalFj", header: "Tanggal FJ" },
      { accessorKey: "noFj", header: "No FJ" },
      { accessorKey: "namaPembeli", header: "Nama Pembeli" },
      { accessorKey: "kodeVarian", header: "Kode Varian" },
      { accessorKey: "namaVarian", header: "Nama Varian" },
      { accessorKey: "kodeWarna", header: "Kode Warna" },
      { accessorKey: "namaWarna", header: "Nama Warna" },
      { accessorKey: "noMesin", header: "Nomor Mesin" },
      { accessorKey: "noRangka", header: "Nomor Rangka" },
      { accessorKey: "status", header: "Status" },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setSelectedId(row.original.id);
                setModalOpen(true);
              }}
              title="Edit"
              aria-label="Edit"
              className="text-primary hover:text-primary/80 transition-colors p-1"
            >
              <PencilIcon className="size-4" />
            </button>
          </div>
        ),
      },
    ];
  }, [page, rowsPerPage]);

  const handleCari = () => {
    setPage(0);
    setActiveFilters(draftFilters);
    setSuccessMessage(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">EKSPEDISI</h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="min-w-48">
            <SelectField
              label="Status"
              options={EKSPEDISI_INVENTORY_STATUS_OPTIONS.filter((o) => o.value !== "")}
              mode="simple"
              value={
                draftFilters.status
                  ? EKSPEDISI_INVENTORY_STATUS_OPTIONS.find(
                      (o) => o.value === draftFilters.status,
                    )
                  : undefined
              }
              onChange={(opt) => {
                const next =
                  opt?.value === ""
                    ? ""
                    : (opt?.value as EkspedisiInventoryStatus) ?? "";
                setDraftFilters((s) => ({ ...s, status: next }));
              }}
              placeholder="Semua Status"
              clearable={false}
            />
          </div>

          <div className="w-64">
            <InputField
              placeholder="Search..."
              value={draftFilters.keyword}
              onChange={(e) =>
                setDraftFilters((s) => ({ ...s, keyword: e.target.value }))
              }
            />
          </div>

          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={handleCari}
          >
            Cari
          </Button>
        </div>
      </div>

      {successMessage ? (
        <Alert className="border border-emerald-200 bg-emerald-50 text-emerald-900">
          <div className="space-y-1">
            <AlertTitle>Berhasil</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </div>
          <button
            type="button"
            className="ml-auto text-xs font-medium underline"
            onClick={() => setSuccessMessage(null)}
          >
            Tutup
          </button>
        </Alert>
      ) : null}

      {listQuery.isError ? (
        <ErrorFallback
          errors={[
            listQuery.error instanceof Error
              ? listQuery.error.message
              : "Terjadi kesalahan saat memuat data.",
          ]}
        />
      ) : (
        <DataTable
          columns={columns}
          data={records}
          serverSide
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={listQuery.data?.data.data?.total ?? 0}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          isLoading={listQuery.isLoading}
          emptyStateMessage="Sorry, no matching records found"
        />
      )}

      <EkspedisiInventoryModal
        open={modalOpen}
        onOpenChange={(o) => {
          setModalOpen(o);
          if (!o) setSelectedId(null);
        }}
        inventoryId={selectedId}
        onProcessSuccess={() =>
          setSuccessMessage("Data ekspedisi berhasil diproses.")
        }
      />
    </div>
  );
}
