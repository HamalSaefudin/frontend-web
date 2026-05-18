import { useMemo } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, EditIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { SelectField, type SelectOption } from "@/components/ui/select";
import { DataTable } from "@/components/ui/table";
import type { PdiFormData } from "../../schemas/validationSchemas";

const KONDISI_OPTIONS: SelectOption[] = [
  { value: "BAIK", label: "Baik" },
  { value: "DAMAGE", label: "Damage" },
  { value: "RUSAK", label: "Rusak" },
];

interface RowProps {
  idx: number;
  onSave: (idx: number) => void;
  onEdit: (idx: number) => void;
  onRemove: (idx: number) => void;
}

function NamaItemCell({ idx }: { idx: number }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<PdiFormData>();
  const isSaved = useWatch({ control, name: `ksu.${idx}.isSaved` }) ?? true;
  const value = useWatch({ control, name: `ksu.${idx}.namaItem` });

  if (!isSaved) {
    return (
      <Controller
        name={`ksu.${idx}.namaItem`}
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            error={errors.ksu?.[idx]?.namaItem?.message}
          />
        )}
      />
    );
  }
  return <>{value || "-"}</>;
}

function JumlahCell({ idx }: { idx: number }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<PdiFormData>();
  const isSaved = useWatch({ control, name: `ksu.${idx}.isSaved` }) ?? true;
  const value = useWatch({ control, name: `ksu.${idx}.jumlah` });

  if (!isSaved) {
    return (
      <Controller
        name={`ksu.${idx}.jumlah`}
        control={control}
        render={({ field }) => (
          <InputField
            variant="number"
            value={String(field.value ?? "")}
            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            error={errors.ksu?.[idx]?.jumlah?.message}
          />
        )}
      />
    );
  }
  return <>{value ?? "-"}</>;
}

function KondisiCell({ idx }: { idx: number }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<PdiFormData>();
  const isSaved = useWatch({ control, name: `ksu.${idx}.isSaved` }) ?? true;
  const kondisi = useWatch({ control, name: `ksu.${idx}.kondisi` });

  if (!isSaved) {
    return (
      <Controller
        name={`ksu.${idx}.kondisi`}
        control={control}
        render={({ field }) => (
          <SelectField
            mode="simple"
            options={KONDISI_OPTIONS}
            value={KONDISI_OPTIONS.find((o) => o.value === field.value)}
            onChange={(opt) =>
              field.onChange(opt?.value as "BAIK" | "DAMAGE" | "RUSAK")
            }
            error={errors.ksu?.[idx]?.kondisi?.message}
          />
        )}
      />
    );
  }
  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        kondisi === "BAIK"
          ? "bg-green-100 text-green-800"
          : kondisi === "DAMAGE"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
      }`}
    >
      {kondisi}
    </span>
  );
}

function ActionsCell({ idx, onSave, onEdit, onRemove }: RowProps) {
  const { control } = useFormContext<PdiFormData>();
  const isSaved = useWatch({ control, name: `ksu.${idx}.isSaved` }) ?? true;

  if (!isSaved) {
    return (
      <div className="flex justify-center gap-1">
        <button
          type="button"
          onClick={() => onSave(idx)}
          className="p-1 hover:bg-muted rounded text-primary"
        >
          <CheckIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="p-1 hover:bg-muted rounded text-destructive"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex justify-center gap-1">
      <button
        type="button"
        onClick={() => onEdit(idx)}
        className="p-1 hover:bg-muted rounded"
      >
        <EditIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onRemove(idx)}
        className="p-1 hover:bg-muted rounded text-destructive"
      >
        <TrashIcon className="size-4" />
      </button>
    </div>
  );
}

type KsuRow = { id: string; index: number };

export function KsuTab() {
  const { control, setValue } = useFormContext<PdiFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "ksu" });

  const handleAdd = () =>
    append({
      id: `ksu-${Date.now()}`,
      namaItem: "",
      jumlah: 1,
      kondisi: "BAIK",
      isSaved: false,
    });

  const handleSaveRow = (idx: number) =>
    setValue(`ksu.${idx}.isSaved`, true);
  const handleEditRow = (idx: number) =>
    setValue(`ksu.${idx}.isSaved`, false);
  const handleRemove = (idx: number) => remove(idx);

  const columns = useMemo<ColumnDef<KsuRow>[]>(
    () => [
      {
        id: "namaItem",
        header: "Nama Item",
        cell: ({ row }) => <NamaItemCell idx={row.original.index} />,
      },
      {
        id: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => <JumlahCell idx={row.original.index} />,
      },
      {
        id: "kondisi",
        header: "Kondisi",
        cell: ({ row }) => <KondisiCell idx={row.original.index} />,
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <ActionsCell
            idx={row.original.index}
            onSave={handleSaveRow}
            onEdit={handleEditRow}
            onRemove={handleRemove}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const data = useMemo<KsuRow[]>(
    () => fields.map((f, i) => ({ id: f.id, index: i })),
    [fields],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">KSU (Kelengkapan Standar Unit)</h3>
        <Button type="button" onClick={handleAdd} size="sm">
          <PlusIcon className="size-4 mr-2" />
          Tambah
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        serverSide={false}
        emptyStateMessage="Belum ada item KSU"
      />
    </div>
  );
}
