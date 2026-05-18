import { useMemo } from "react";
import { Controller, useFieldArray, useFormContext, type Control, type UseFormSetValue } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { CheckIcon, EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import type { FjbDetailForm, FjbJobForm, FjbPartForm } from "../../schemas/validationSchemas";

type JobRow = FjbJobForm & { index: number };
type PartRow = FjbPartForm & { index: number };
type PartArrayName = "partsWithQr" | "partsWithoutQr";

function formatIDR(n: number | undefined): string {
  return `Rp ${(n ?? 0).toLocaleString("id-ID")}`;
}

function ActionsCell({ isSaved, onToggle, onRemove }: { isSaved: boolean; onToggle: () => void; onRemove: () => void }) {
  return (
    <div className="flex gap-1">
      <button type="button" onClick={onToggle} className="p-1 hover:bg-muted rounded" aria-label={isSaved ? "Edit" : "Simpan baris"}>
        {isSaved ? <EditIcon className="size-4" /> : <CheckIcon className="size-4 text-green-600" />}
      </button>
      <button type="button" onClick={onRemove} className="p-1 hover:bg-muted rounded text-destructive" aria-label="Hapus">
        <TrashIcon className="size-4" />
      </button>
    </div>
  );
}

function buildJobColumns(
  watched: FjbJobForm[],
  control: Control<FjbDetailForm>,
  setValue: UseFormSetValue<FjbDetailForm>,
  remove: (index: number) => void,
): ColumnDef<JobRow>[] {
  return [
    { id: "no", header: "No", cell: ({ row }) => row.original.index + 1 },
    {
      id: "kodeJasa",
      header: "Kode",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return watched[i]?.kodeJasa || "-";
        return (
          <Controller
            name={`jobs.${i}.kodeJasa`}
            control={control}
            render={({ field }) => <InputField {...field} placeholder="Kode" />}
          />
        );
      },
    },
    {
      id: "namaJasa",
      header: "Nama",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return watched[i]?.namaJasa || "-";
        return (
          <Controller
            name={`jobs.${i}.namaJasa`}
            control={control}
            render={({ field }) => <InputField {...field} placeholder="Nama" />}
          />
        );
      },
    },
    {
      id: "hargaSistem",
      header: "Harga",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return formatIDR(watched[i]?.hargaSistem);
        return (
          <Controller
            name={`jobs.${i}.hargaSistem`}
            control={control}
            render={({ field }) => (
              <InputField
                variant="currency"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
              />
            )}
          />
        );
      },
    },
    {
      id: "totalHarga",
      header: "Total",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return formatIDR(watched[i]?.totalHarga);
        return (
          <Controller
            name={`jobs.${i}.totalHarga`}
            control={control}
            render={({ field }) => (
              <InputField
                variant="currency"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
              />
            )}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        return (
          <ActionsCell
            isSaved={isSaved}
            onToggle={() => setValue(`jobs.${i}.isSaved`, !isSaved)}
            onRemove={() => remove(i)}
          />
        );
      },
    },
  ];
}

function buildPartColumns(
  arrayName: PartArrayName,
  watched: FjbPartForm[],
  control: Control<FjbDetailForm>,
  setValue: UseFormSetValue<FjbDetailForm>,
  remove: (index: number) => void,
): ColumnDef<PartRow>[] {
  return [
    { id: "no", header: "No", cell: ({ row }) => row.original.index + 1 },
    {
      id: "kodePart",
      header: "Kode",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return watched[i]?.kodePart || "-";
        return (
          <Controller
            name={`${arrayName}.${i}.kodePart`}
            control={control}
            render={({ field }) => <InputField {...field} placeholder="Kode" />}
          />
        );
      },
    },
    {
      id: "namaPart",
      header: "Nama",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return watched[i]?.namaPart || "-";
        return (
          <Controller
            name={`${arrayName}.${i}.namaPart`}
            control={control}
            render={({ field }) => <InputField {...field} placeholder="Nama" />}
          />
        );
      },
    },
    {
      id: "qty",
      header: "Qty",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return watched[i]?.qty ?? 1;
        return (
          <Controller
            name={`${arrayName}.${i}.qty`}
            control={control}
            render={({ field }) => (
              <InputField
                variant="number"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
              />
            )}
          />
        );
      },
    },
    {
      id: "totalHarga",
      header: "Total",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return formatIDR(watched[i]?.totalHarga);
        return (
          <Controller
            name={`${arrayName}.${i}.totalHarga`}
            control={control}
            render={({ field }) => (
              <InputField
                variant="currency"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
              />
            )}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        return (
          <ActionsCell
            isSaved={isSaved}
            onToggle={() => setValue(`${arrayName}.${i}.isSaved`, !isSaved)}
            onRemove={() => remove(i)}
          />
        );
      },
    },
  ];
}

export function DataTransaksiTab() {
  const { control, watch, setValue } = useFormContext<FjbDetailForm>();

  const { fields: jobFields, append: appendJob, remove: removeJob } = useFieldArray({ control, name: "jobs" });
  const { fields: partQrFields, append: appendPartQr, remove: removePartQr } = useFieldArray({ control, name: "partsWithQr" });
  const { fields: partNoQrFields, append: appendPartNoQr, remove: removePartNoQr } = useFieldArray({ control, name: "partsWithoutQr" });

  const watchedJobs: FjbJobForm[] = watch("jobs") ?? [];
  const watchedPartsWithQr: FjbPartForm[] = watch("partsWithQr") ?? [];
  const watchedPartsWithoutQr: FjbPartForm[] = watch("partsWithoutQr") ?? [];

  const totalEstimasiWaktu = watchedJobs.reduce((s, j) => s + (j?.estimasiWaktu || 0), 0);
  const jobTotal = watchedJobs.reduce((s, j) => s + (j?.totalHarga || 0), 0);
  const partQrTotal = watchedPartsWithQr.reduce((s, p) => s + (p?.totalHarga || 0), 0);
  const partNoQrTotal = watchedPartsWithoutQr.reduce((s, p) => s + (p?.totalHarga || 0), 0);
  const totalBeforeDiskon = jobTotal + partQrTotal + partNoQrTotal;
  const jobDiskon = watchedJobs.reduce((s, j) => s + ((j?.hargaSistem || 0) - (j?.totalHarga || 0)), 0);
  const partQrDiskon = watchedPartsWithQr.reduce((s, p) => s + (((p?.hargaSatuan || 0) * (p?.qty || 1)) - (p?.totalHarga || 0)), 0);
  const partNoQrDiskon = watchedPartsWithoutQr.reduce((s, p) => s + (((p?.hargaSatuan || 0) * (p?.qty || 1)) - (p?.totalHarga || 0)), 0);
  const totalDiskon = jobDiskon + partQrDiskon + partNoQrDiskon;

  const jobColumns = useMemo(
    () => buildJobColumns(watchedJobs, control, setValue, removeJob),
    [watchedJobs, control, setValue, removeJob],
  );
  const partQrColumns = useMemo(
    () => buildPartColumns("partsWithQr", watchedPartsWithQr, control, setValue, removePartQr),
    [watchedPartsWithQr, control, setValue, removePartQr],
  );
  const partNoQrColumns = useMemo(
    () => buildPartColumns("partsWithoutQr", watchedPartsWithoutQr, control, setValue, removePartNoQr),
    [watchedPartsWithoutQr, control, setValue, removePartNoQr],
  );

  const jobRows: JobRow[] = jobFields.map((_f, index) => ({ ...(watchedJobs[index] ?? { kodeJasa: "", namaJasa: "" }), index }));
  const partQrRows: PartRow[] = partQrFields.map((_f, index) => ({ ...(watchedPartsWithQr[index] ?? { kodePart: "", namaPart: "" }), index }));
  const partNoQrRows: PartRow[] = partNoQrFields.map((_f, index) => ({ ...(watchedPartsWithoutQr[index] ?? { kodePart: "", namaPart: "" }), index }));

  return (
    <TabsContent value="data-transaksi" className="space-y-6">
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Jasa Bengkel</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendJob({ kodeJasa: "", namaJasa: "", isSaved: false })}
          >
            <PlusIcon className="size-4 mr-1" />
            Tambah
          </Button>
        </div>
        <DataTable columns={jobColumns} data={jobRows} serverSide={false} emptyStateMessage="Belum ada jasa" />
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Part Dengan QR</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendPartQr({ kodePart: "", namaPart: "", qty: 1, isSaved: false })}
          >
            <PlusIcon className="size-4 mr-1" />
            Tambah
          </Button>
        </div>
        <DataTable columns={partQrColumns} data={partQrRows} serverSide={false} emptyStateMessage="Belum ada part" />
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Part Tanpa QR</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendPartNoQr({ kodePart: "", namaPart: "", qty: 1, isSaved: false })}
          >
            <PlusIcon className="size-4 mr-1" />
            Tambah
          </Button>
        </div>
        <DataTable columns={partNoQrColumns} data={partNoQrRows} serverSide={false} emptyStateMessage="Belum ada part" />
      </section>

      <div className="text-right space-y-1 text-sm">
        <p>Total Estimasi Waktu: {totalEstimasiWaktu} menit</p>
        <p>Total Sebelum Diskon: {formatIDR(totalBeforeDiskon)}</p>
        <p>Diskon: {formatIDR(totalDiskon)}</p>
        <p className="font-semibold">Total Setelah Diskon: {formatIDR(totalBeforeDiskon - totalDiskon)}</p>
      </div>
    </TabsContent>
  );
}
