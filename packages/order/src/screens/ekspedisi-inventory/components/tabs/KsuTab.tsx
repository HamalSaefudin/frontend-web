import { InputField, Button, Switch } from "@frontend/ui"
import { useCallback, useMemo } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import type { EkspedisiInventoryProcessFormValues } from "../../types";

function getItemsErrorMessage(
  errors: unknown,
): string | undefined {
  if (!errors || typeof errors !== "object") return undefined;
  const maybe = errors as { items?: { message?: string } | unknown };
  const items = maybe.items;
  if (!items) return undefined;

  // react-hook-form may represent array-level errors as an array that also carries a `message`.
  if (Array.isArray(items)) {
    const msg = (items as unknown as { message?: string }).message;
    return msg;
  }

  if (typeof items === "object") {
    if ("message" in items) return (items as { message?: string }).message;
    if ("root" in items && typeof (items as { root?: { message?: string } }).root?.message === "string") {
      return (items as { root?: { message?: string } }).root?.message;
    }
  }

  return undefined;
}

export function KsuTab() {
  const { control, watch, formState: { errors }, setValue } =
    useFormContext<EkspedisiInventoryProcessFormValues>();
  const { append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  const itemsErrors = (errors as unknown as { items?: Array<{ [key: string]: unknown }> | { message?: string } | undefined }).items;
  const getFieldErrorMessage = useCallback((idx: number, field: string): string | undefined => {
    const maybeItems = itemsErrors;
    if (!maybeItems || Array.isArray(maybeItems)) {
      const itemErr = Array.isArray(maybeItems) ? maybeItems[idx] : undefined;
      const val = itemErr?.[field] as { message?: string } | undefined;
      return val?.message;
    }
    return undefined;
  }, [itemsErrors]);

  const columns: ColumnDef<
    (typeof watchedItems)[number] & { index: number }
  >[] = useMemo(() => {
    return [
      {
        id: "rowNo",
        header: "No",
        cell: ({ row }) => row.original.index + 1,
      },
      {
        accessorKey: "kodeKsu",
        header: "Kode KSU",
        cell: ({ row }) => {
          const idx = row.original.index;
          const inputError = getFieldErrorMessage(idx, "kodeKsu");

          return (
            <Controller
              name={`items.${idx}.kodeKsu`}
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Kode KSU"
                  id={`kode-ksu-${idx}`}
                  error={inputError}
                  onChange={(e) => {
                    field.onChange(e);
                    const value = (e.target as HTMLInputElement).value;
                    setValue(`items.${idx}.qrCode`, value ? `QR-${value}` : "", {
                      shouldValidate: false,
                      shouldDirty: true,
                    });
                  }}
                  placeholder="Kode KSU"
                />
              )}
            />
          );
        },
      },
      {
        accessorKey: "namaKsu",
        header: "Nama KSU",
        cell: ({ row }) => {
          const idx = row.original.index;
          const inputError = getFieldErrorMessage(idx, "namaKsu");

          return (
            <Controller
              name={`items.${idx}.namaKsu`}
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Nama KSU"
                  id={`nama-ksu-${idx}`}
                  error={inputError}
                  placeholder="Nama KSU"
                />
              )}
            />
          );
        },
      },
      {
        accessorKey: "jenisKsu",
        header: "Jenis KSU",
        cell: ({ row }) => {
          const idx = row.original.index;
          return (
            <Controller
              name={`items.${idx}.jenisKsu`}
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Jenis KSU"
                  id={`jenis-ksu-${idx}`}
                  placeholder="Jenis"
                />
              )}
            />
          );
        },
      },
      {
        id: "qrCode",
        header: "QR Code",
        cell: ({ row }) => row.original.qrCode?.trim() ? row.original.qrCode : "-",
      },
      {
        id: "scan",
        header: "Scan",
        cell: ({ row }) => {
          const idx = row.original.index;
          const errorMessage = getFieldErrorMessage(idx, "scan");

          return (
            <div className="flex flex-col gap-1">
              <Controller
                name={`items.${idx}.scan`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    aria-label={`Scan ${idx + 1}`}
                  />
                )}
              />
              {errorMessage ? <p className="text-xs text-destructive">{errorMessage}</p> : null}
            </div>
          );
        },
      },
      {
        id: "menyusul",
        header: "Menyusul",
        cell: ({ row }) => {
          const idx = row.original.index;
          return (
            <Controller
              name={`items.${idx}.menyusul`}
              control={control}
              render={({ field }) => (
                <Switch
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  aria-label={`Menyusul ${idx + 1}`}
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
          const idx = row.original.index;
          return (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                title="Delete"
                aria-label="Delete"
                className="text-destructive hover:text-destructive/80"
                onClick={() => remove(idx)}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [control, getFieldErrorMessage, remove, setValue]);

  const itemsWithIndex = useMemo(
    () => (watchedItems ?? []).map((item, index) => ({ ...item, index })),
    [watchedItems],
  );

  const itemsMinErrorMessage = getItemsErrorMessage(errors);

  return (
    <div className="space-y-4">
      {itemsMinErrorMessage ? (
        <p className="text-sm text-destructive">{itemsMinErrorMessage}</p>
      ) : null}

      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() =>
            append({
              kodeKsu: "",
              namaKsu: "",
              jenisKsu: "",
              qrCode: "",
              scan: false,
              menyusul: false,
            })
          }
        >
          <PlusIcon className="size-4" />
          + Tambah
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={itemsWithIndex}
        serverSide={false}
        emptyStateMessage="Tidak ada item KSU"
      />
    </div>
  );
}

