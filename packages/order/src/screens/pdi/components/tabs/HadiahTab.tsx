import { InputField, DataTable } from "@frontend/ui"
import { useMemo } from "react";
import type { PdiFormData } from "../../schemas/validationSchemas";

interface RowProps {
  idx: number;
  onSave: (idx: number) => void;
  onEdit: (idx: number) => void;
  onRemove: (idx: number) => void;
}

function NamaHadiahCell({ idx }: { idx: number }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<PdiFormData>();
  const isSaved = useWatch({ control, name: `hadiah.${idx}.isSaved` }) ?? true;
  const value = useWatch({ control, name: `hadiah.${idx}.namaHadiah` });

  if (!isSaved) {
    return (
      <Controller
        name={`hadiah.${idx}.namaHadiah`}
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            error={errors.hadiah?.[idx]?.namaHadiah?.message}
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
  const isSaved = useWatch({ control, name: `hadiah.${idx}.isSaved` }) ?? true;
  const value = useWatch({ control, name: `hadiah.${idx}.jumlah` });

  if (!isSaved) {
    return (
      <Controller
        name={`hadiah.${idx}.jumlah`}
        control={control}
        render={({ field }) => (
          <InputField
            variant="number"
            value={String(field.value ?? "")}
            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            error={errors.hadiah?.[idx]?.jumlah?.message}
          />
        )}
      />
    );
  }
  return <>{value ?? "-"}</>;
}

function KeteranganCell({ idx }: { idx: number }) {
  const { control } = useFormContext<PdiFormData>();
  const isSaved = useWatch({ control, name: `hadiah.${idx}.isSaved` }) ?? true;
  const value = useWatch({ control, name: `hadiah.${idx}.keterangan` });

  if (!isSaved) {
    return (
      <Controller
        name={`hadiah.${idx}.keterangan`}
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
  const isSaved = useWatch({ control, name: `hadiah.${idx}.isSaved` }) ?? true;

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

type HadiahRow = { id: string; index: number };

export function HadiahTab() {
  const { control, setValue } = useFormContext<PdiFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "hadiah" });

  const handleAdd = () =>
    append({
      id: `hadiah-${Date.now()}`,
      namaHadiah: "",
      jumlah: 1,
      keterangan: "",
      isSaved: false,
    });

  const handleSaveRow = (idx: number) =>
    setValue(`hadiah.${idx}.isSaved`, true);
  const handleEditRow = (idx: number) =>
    setValue(`hadiah.${idx}.isSaved`, false);
  const handleRemove = (idx: number) => remove(idx);

  const columns = useMemo<ColumnDef<HadiahRow>[]>(
    () => [
      {
        id: "namaHadiah",
        header: "Nama Hadiah",
        cell: ({ row }) => <NamaHadiahCell idx={row.original.index} />,
      },
      {
        id: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => <JumlahCell idx={row.original.index} />,
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

  const data = useMemo<HadiahRow[]>(
    () => fields.map((f, i) => ({ id: f.id, index: i })),
    [fields],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Hadiah</h3>
        <Button type="button" onClick={handleAdd} size="sm">
          <PlusIcon className="size-4 mr-2" />
          Tambah
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        serverSide={false}
        emptyStateMessage="Belum ada item hadiah"
      />
    </div>
  );
}
