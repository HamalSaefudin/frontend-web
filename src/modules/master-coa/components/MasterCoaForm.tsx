import { AppModal } from '@/components/AppModal';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { SelectField, type SelectOption } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/ui/table';
import type { CoaTransaction, MasterCoa } from '@/services/master-coa';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { CheckIcon, EditIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { COA_CATEGORY_OPTIONS } from '../constants';
import { useQueryCabang, useQueryMasterCoaDetail } from '../hooks';
import {
  masterCoaCreateSchema,
  masterCoaUpdateSchema,
  type MasterCoaCreateFormData,
  type MasterCoaUpdateFormData,
} from '../utils/validationSchemas';

interface MasterCoaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MasterCoaCreateFormData) => Promise<void>;
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
  subgroup?: string;
  group?: string;
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
              <SelectField
                placeholder="Pilih"
                options={COA_CATEGORY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
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

// Helper to convert CoaTransaction to form transaction format
function toFormTransaction(t: CoaTransaction) {
  return {
    transactionName: t.transactionName,
    category: t.category,
    subgroup: t.subgroup,
    group: t.group,
    isSaved: true,
  };
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

  // Fetch full detail when editing (list data doesn't include transactions)
  const coaId = initialData?.coaId;
  const { data: detailResponse, isLoading: detailLoading } = useQueryMasterCoaDetail(coaId ?? '');
  const detailData = detailResponse;

  const { data: cabangData = [], isLoading: cabangLoading } = useQueryCabang();

  const branchOptions: SelectOption[] = useMemo(
    () => cabangData.map((c) => ({ value: c.kodeCabang, label: c.namaCabang })),
    [cabangData],
  );

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm<MasterCoaCreateFormData | MasterCoaUpdateFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      coaName: '',
      branches: [],
      statusActive: true,
      transactions: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'transactions',
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
      // For edit mode, use detailData dari API (list tidak include transactions)
      const coaData = detailData || initialData;
      const formTransactions = (coaData as unknown as { transactions?: CoaTransaction[] }).transactions?.map(toFormTransaction) ?? [];
      replace(formTransactions);
      reset({
        coaName: coaData.coaName,
        branches: coaData.branches,
        statusActive: coaData.status === 'ACTIVE',
        transactions: formTransactions,
      });
    } else {
      // For create mode, clear everything
      replace([]);
      reset({
        coaName: '',
        branches: [],
        statusActive: true,
        transactions: [],
      });
    }
  }, [open, initialData, detailData, reset, replace]);

  const onButtonClick = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    const formValues = getValues();
    try {
      await onSubmit(formValues);
      replace([]);
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error('[MasterCoaForm] Submit error:', err);
      throw err;
    }
  };

  const handleClose = () => {
    replace([]);
    reset();
    onOpenChange(false);
  };

  // Show loading saat fetch detail saat edit mode
  if (isEdit && detailLoading) {
    return (
      <AppModal
        isOpen={open}
        onClose={handleClose}
        title={isEdit ? 'Edit Master COA' : 'Tambah Master COA'}
        className="max-w-4xl"
      >
        <LoadingOverlay message="Memuat data COA..." />
      </AppModal>
    );
  }

  return (
    <AppModal
      isOpen={open}
      onClose={handleClose}
      title={isEdit ? 'Edit Master COA' : 'Tambah Master COA'}
      className="max-w-4xl"
    >
      <form className="space-y-4">
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
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="button" onClick={onButtonClick} disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}