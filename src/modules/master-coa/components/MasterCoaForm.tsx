import { useEffect, useMemo } from 'react';
import {
  useForm,
  Controller,
  useFieldArray,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { AppModal } from '@/components/AppModal';
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { SelectField, type SelectOption } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/ui/table';
import { PlusIcon, TrashIcon, CheckIcon, EditIcon } from 'lucide-react';
import {
  masterCoaCreateSchema,
  masterCoaUpdateSchema,
  type MasterCoaCreateFormData,
  type MasterCoaUpdateFormData,
} from '../utils/validationSchemas';
import { COA_CATEGORY_OPTIONS } from '../constants';
import type { MasterCoa } from '@/services/master-coa';
import { useQueryCabang } from '../hooks';

interface MasterCoaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MasterCoaCreateFormData | MasterCoaUpdateFormData) => Promise<void>;
  initialData?: MasterCoa | null;
  isLoading?: boolean;
  serverErrors?: { field: string; message: string }[];
  errorMessage?: string;
}

const emptyTransaction = {
  transactionName: '',
  category: 'TRX_IN' as const,
  subgroup: '',
  group: '',
  isSaved: true,
};

type TransactionRow = {
  index: number;
  transactionName: string;
  category: 'TRX_IN' | 'TRX_OUT';
  subgroup: string;
  group: string;
  isSaved: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTransactionColumns(
  watched: MasterCoaCreateFormData['transactions'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any,
  remove: (index: number) => void,
): ColumnDef<TransactionRow>[] {
  return [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original.index + 1,
    },
    {
      id: 'transactionName',
      header: 'Nama Transaksi',
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return watched[i]?.transactionName || '-';
        return (
          <Controller
            name={`transactions.${i}.transactionName`}
            control={control}
            render={({ field }) => <InputField {...field} placeholder="Nama transaksi" />}
          />
        );
      },
    },
    {
      id: 'category',
      header: 'Kategori',
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) {
          const opt = COA_CATEGORY_OPTIONS.find((o) => o.value === watched[i]?.category);
          return opt?.label || '-';
        }
        return (
          <Controller
            name={`transactions.${i}.category`}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {COA_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
        );
      },
    },
    {
      id: 'subgroup',
      header: 'Subgrup',
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return watched[i]?.subgroup || '-';
        return (
          <Controller
            name={`transactions.${i}.subgroup`}
            control={control}
            render={({ field }) => <InputField {...field} placeholder="Subgrup" />}
          />
        );
      },
    },
    {
      id: 'group',
      header: 'Grup',
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        if (isSaved) return watched[i]?.group || '-';
        return (
          <Controller
            name={`transactions.${i}.group`}
            control={control}
            render={({ field }) => <InputField {...field} placeholder="Grup" />}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const i = row.original.index;
        const isSaved = watched[i]?.isSaved ?? true;
        return (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setValue(`transactions.${i}.isSaved`, !isSaved)}
              className="p-1 hover:bg-muted rounded"
            >
              {isSaved ? <EditIcon className="size-4" /> : <CheckIcon className="size-4 text-green-600" />}
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1 hover:bg-muted rounded text-destructive"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        );
      },
    },
  ];
}

export function MasterCoaForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
  serverErrors,
  errorMessage,
}: MasterCoaFormProps) {
  const isEdit = !!initialData;
  const schema = isEdit ? masterCoaUpdateSchema : masterCoaCreateSchema;

  const { data: cabangData = [], isLoading: cabangLoading } = useQueryCabang();

  const branchOptions: SelectOption[] = useMemo(
    () => cabangData.map((c) => ({ value: c.kodeCabang, label: c.namaCabang })),
    [cabangData],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<MasterCoaCreateFormData | MasterCoaUpdateFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      coaName: '',
      branches: [],
      statusActive: true,
      transactions: [{ ...emptyTransaction, isSaved: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'transactions' as 'transactions',
  });

  const watchedTransactions: MasterCoaCreateFormData['transactions'] = watch('transactions') ?? [];

  const transactionColumns = useMemo(
    () => buildTransactionColumns(watchedTransactions, control, setValue, remove),
    [watchedTransactions, control, setValue, remove],
  );

  const transactionRows: TransactionRow[] = fields.map((_f, index) => ({
    index,
    ...(watchedTransactions[index] ?? {
      transactionName: '',
      category: 'TRX_IN' as const,
      subgroup: '',
      group: '',
      isSaved: true,
    }),
  }));

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      reset({
        coaName: initialData.coaName,
        branches: initialData.branches,
        statusActive: initialData.status === 'ACTIVE',
      });
    } else {
      reset({
        coaName: '',
        branches: [],
        statusActive: true,
        transactions: [{ ...emptyTransaction, isSaved: false }],
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: MasterCoaCreateFormData | MasterCoaUpdateFormData) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  const createErrors = !isEdit
    ? (errors as import('react-hook-form').FieldErrors<MasterCoaCreateFormData>)
    : null;

  return (
    <AppModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={isEdit ? 'Edit Master COA' : 'Tambah Master COA'}
      className="max-w-4xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <InputField
          label="Nama COA"
          placeholder="Masukkan nama COA"
          error={
            errors.coaName?.message ||
            serverErrors?.find((e) => e.field === 'coaName')?.message
          }
          {...register('coaName')}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="branches"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Cabang"
                mode="multi"
                placeholder={cabangLoading ? 'Memuat cabang...' : 'Pilih cabang...'}
                options={branchOptions}
                value={field.value}
                onChange={field.onChange}
                required
                error={errors.branches?.message}
                disabled={isSubmitting || cabangLoading}
              />
            )}
          />

          <Controller
            name="statusActive"
            control={control}
            render={({ field }) => (
              <div className="flex h-10 items-center justify-between rounded-md border border-input px-3 md:h-auto md:min-h-[2.5rem] md:py-2">
                <label className="text-sm font-medium">Status aktif</label>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </div>
            )}
          />
        </div>

        {!isEdit && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Jenis Transaksi</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => append({ ...emptyTransaction, isSaved: false })}
              >
                <PlusIcon className="size-4" />
                Tambah
              </Button>
            </div>

            <DataTable
              columns={transactionColumns}
              data={transactionRows}
              serverSide={false}
              emptyStateMessage="Belum ada transaksi"
            />
          </div>
        )}

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

        {serverErrors && serverErrors.length > 0 && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive space-y-1">
            {serverErrors.map((err, i) => (
              <p key={i}>{err.message}</p>
            ))}
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}