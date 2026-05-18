import { useState, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField, type SelectOption } from "@/components/ui/select";
import { InputField } from "@/components/ui/input-field";
import { DataTable } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { PdiUnit, PdiStatus } from "@/types";
import type { PdiFilters } from "./hooks";
import { useQueryPdiUnits, useQueryCabang } from "./hooks";
import { PdiModal } from "./components/PdiModal";

const STATUS_COLORS: Record<PdiStatus, string> = {
  BELUM_PDI: "bg-yellow-100 text-yellow-800",
  SUDAH_PDI: "bg-green-100 text-green-800",
  DITOLAK: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<PdiStatus, string> = {
  BELUM_PDI: "Belum PDI",
  SUDAH_PDI: "Sudah PDI",
  DITOLAK: "Ditolak",
};

const FILTER_OPTIONS: SelectOption[] = [
  { value: "NOMOR_MESIN", label: "Nomor Mesin" },
  { value: "KODE_VARIAN", label: "Kode Varian" },
];

export function PdiScreen() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<"BELUM_PDI" | "SUDAH_PDI">("BELUM_PDI");
  const [selectedCabangId, setSelectedCabangId] = useState<string>("");
  const [filterBy, setFilterBy] = useState<"NOMOR_MESIN" | "KODE_VARIAN">("NOMOR_MESIN");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<PdiUnit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters: PdiFilters = useMemo(
    () => ({
      status: activeTab,
      cabangId: selectedCabangId || undefined,
      filterBy: filterBy,
      search: searchQuery || undefined,
    }),
    [activeTab, selectedCabangId, filterBy, searchQuery]
  );

  const { data, isLoading, refetch } = useQueryPdiUnits(
    page + 1,
    rowsPerPage,
    filters
  );

  const { data: branches = [] } = useQueryCabang();

  const branchOptions: SelectOption[] = [
    { value: "", label: "Semua Cabang" },
    ...branches.map((b) => ({ value: b.id, label: b.namaCabang })),
  ];

  const handleSearch = () => {
    setPage(0);
    refetch();
  };

  const handleProsesPdi = (unit: PdiUnit) => {
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUnit(null);
  };

  const columns: ColumnDef<PdiUnit>[] = useMemo(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row }) => row.index + 1 + page * rowsPerPage,
        meta: { className: "min-w-12" },
      },
      {
        accessorKey: "noFj",
        header: "No. FJ",
        meta: { className: "min-w-36" },
      },
      {
        accessorKey: "tanggalFj",
        header: "Tanggal FJ",
        cell: ({ getValue }) => dayjs(getValue<string>()).format("DD MMM YYYY"),
        meta: { className: "min-w-32" },
      },
      {
        accessorKey: "kodeVarian",
        header: "Kode Varian",
        meta: { className: "min-w-32" },
      },
      {
        accessorKey: "namaVarian",
        header: "Nama Varian",
        meta: { className: "min-w-48" },
      },
      {
        accessorKey: "kodeWarna",
        header: "Kode Warna",
        meta: { className: "min-w-28" },
      },
      {
        accessorKey: "namaWarna",
        header: "Nama Warna",
        meta: { className: "min-w-32" },
      },
      {
        accessorKey: "nomorMesin",
        header: "Nomor Mesin",
        meta: { className: "min-w-36" },
      },
      {
        accessorKey: "nomorRangka",
        header: "Nomor Rangka",
        meta: { className: "min-w-36" },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<PdiStatus>();
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}
            >
              {STATUS_LABELS[status]}
            </span>
          );
        },
        meta: { className: "min-w-28" },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleProsesPdi(row.original)}
          >
            Proses PDI
          </Button>
        ),
        meta: { className: "min-w-32" },
      },
    ],
    [page, rowsPerPage]
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Pre Delivery Inspection</h1>

      {/* Branch Dropdown */}
      <div className="w-64">
        <SelectField
          label="Cabang"
          value={selectedCabangId}
          onChange={(value) => {
            setSelectedCabangId(value || "");
            setPage(0);
          }}
          options={branchOptions}
          placeholder="Pilih Cabang"
        />
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as "BELUM_PDI" | "SUDAH_PDI");
          setPage(0);
        }}
      >
        <TabsList>
          <TabsTrigger value="BELUM_PDI">Belum PDI</TabsTrigger>
          <TabsTrigger value="SUDAH_PDI">Sudah PDI</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Toolbar */}
      <div className="flex gap-4 items-end">
        <div className="w-48">
          <SelectField
            label="Filter"
            value={filterBy}
            onChange={(value) =>
              setFilterBy((value as "NOMOR_MESIN") || "NOMOR_MESIN")
            }
            options={FILTER_OPTIONS}
            placeholder="Pilih Filter"
          />
        </div>
        <div className="flex-1 min-w-64">
          <InputField
            label="Pencarian"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Masukkan keyword..."
          />
        </div>
        <Button onClick={handleSearch}>
          <SearchIcon className="size-4 mr-2" />
          Cari
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        serverSide={false}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={data?.total ?? 0}
        onPageChange={setPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setPage(0);
        }}
      />

      {/* PDI Modal */}
      <PdiModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        unit={selectedUnit}
      />
    </div>
  );
}