import { InputField, SelectField, type SelectOption, DataTable } from "@frontend/ui"
import { useMemo } from "react";
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

function NamaPartCell({ idx }: { idx: number }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<PdiFormData>();
  const isSaved = useWatch({ control, name: `parts.${idx}.isSaved` }) ?? true;
  const value = useWatch({ control, name: `parts.${idx}.namaPart` });

  if (!isSaved) {
    return (
      <Controller
        name={`parts.${idx}.namaPart`}
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            error={errors.parts?.[idx]?.namaPart?.message}
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
  const isSaved = useWatch({ control, name: `parts.${idx}.isSaved` }) ?? true;
  const value = useWatch({ control, name: `parts.${idx}.jumlah` });

  if (!isSaved) {
    return (
      <Controller
        name={`parts.${idx}.jumlah`}
        control={control}
        render={({ field }) => (
          <InputField
            variant="number"
            value={String(field.value ?? "")}
            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            error={errors.parts?.[idx]?.jumlah?.message}
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
  const isSaved = useWatch({ control, name: `parts.${idx}.isSaved` }) ?? true;
  const kondisi = useWatch({ control, name: `parts.${idx}.kondisi` });

  if (!isSaved) {
    return (
      <Controller
        name={`parts.${idx}.kondisi`}
        control={control}
        render={({ field }) => (
          <SelectField
            mode="simple"
            options={KONDISI_OPTIONS}
            value={KONDISI_OPTIONS.find((o) => o.value === field.value)}
            onChange={(opt) =>
              field.onChange(opt?.value as "BAIK" | "DAMAGE" | "RUSAK")
            }
            error={errors.parts?.[idx]?.kondisi?.message}
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

function KeteranganCell({ idx }: { idx: number }) {
  const { control } = useFormContext<PdiFormData>();
  const isSaved = useWatch({ control, name: `parts.${idx}.isSaved` }) ?? true;
  const value = useWatch({ control, name: `parts.${idx}.keterangan` });

  if (!isSaved) {
    return (
      <Controller
        name={`parts.${idx}.keterangan`}
        control={control}
        render={({ field }) => (
          <InputField {...field} value={field.value ?? ""} />
        )}
      />
    );
  }
  return <>{value || "-"}</>;
}

function ActionsCell({ idx, onSave, onEdit, onRemove }: RowProps) {
  const { control } = useFormContext<PdiFormData>();
  const isSaved = useWatch({ control, name: `parts.${idx}.isSaved` }) ?? true;

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

type PartRow = { id: string; index: number };

export function PartTab() {
  const { control, setValue } = useFormContext<PdiFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "parts" });

  const handleAdd = () =>
    append({
      id: `part-${Date.now()}`,
      namaPart: "",
      jumlah: 1,
      kondisi: "BAIK",
      keterangan: "",
      isSaved: false,
    });

  const handleSaveRow = (idx: number) =>
    setValue(`parts.${idx}.isSaved`, true);
  const handleEditRow = (idx: number) =>
    setValue(`parts.${idx}.isSaved`, false);
  const handleRemove = (idx: number) => remove(idx);

  const columns = useMemo<ColumnDef<PartRow>[]>(
    () => [
      {
        id: "namaPart",
        header: "Nama Part",
        cell: ({ row }) => <NamaPartCell idx={row.original.index} />,
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
        id: "keterangan",
        header: "Keterangan",
        cell: ({ row }) => <KeteranganCell idx={row.original.index} />,
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

  const data = useMemo<PartRow[]>(
    () => fields.map((f, i) => ({ id: f.id, index: i })),
    [fields],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Part</h3>
        <Button type="button" onClick={handleAdd} size="sm">
          <PlusIcon className="size-4 mr-2" />
          Tambah
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        serverSide={false}
        emptyStateMessage="Belum ada item part"
      />
    </div>
  );
}
