import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppModal } from '@/components/AppModal';
import { InputField } from '@/components/ui/input-field';
import { SelectField, type SelectOption } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { lokasiFormSchema, type LokasiFormInput } from '../utils/validationSchemas';
import type { LokasiWarehouse } from '@/services/master-locator';

interface LokasiFormModalProps {
  mode?: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<LokasiWarehouse, 'id'>) => Promise<void>;
  initialData?: LokasiWarehouse;
  isLoading?: boolean;
}

const CABANG_OPTIONS: SelectOption[] = [
  { value: 'JKT01', label: 'JKT01 - Jakarta' },
  { value: 'SBY01', label: 'SBY01 - Surabaya' },
  { value: 'BDG01', label: 'BDG01 - Bandung' },
  { value: 'MDN01', label: 'MDN01 - Medan' },
  { value: 'YOG01', label: 'YOG01 - Yogyakarta' },
];

export function LokasiFormModal({
  mode = 'create',
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: LokasiFormModalProps) {
  const isEdit = mode === 'edit';
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<LokasiFormInput>({
    resolver: zodResolver(lokasiFormSchema),
    defaultValues: {
      kodeLokasi: '',
      kodeCabang: '',
      namaLokasi: '',
    },
  });

  const watchedKodeCabang = watch('kodeCabang');

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      reset({
        kodeLokasi: initialData.kodeLokasi || '',
        kodeCabang: initialData.kodeCabang || '',
        namaLokasi: initialData.namaLokasi || '',
      });
    } else {
      reset({
        kodeLokasi: '',
        kodeCabang: '',
        namaLokasi: '',
      });
    }
  }, [initialData, open, reset]);

  const onFormSubmit = async (data: LokasiFormInput) => {
    try {
      await onSubmit(data);
      reset();
      onOpenChange(false);
    } catch {
      // Error handled by parent
    }
  };

  const getTitle = () => {
    return isEdit ? 'Edit Lokasi Warehouse' : 'Tambah Lokasi Warehouse';
  };

  return (
    <AppModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={getTitle()}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <InputField
          {...register('kodeLokasi')}
          label="Kode Lokasi"
          placeholder="Contoh: WH-JKT-01"
          required
          disabled={isEdit || isSubmitting}
          error={errors.kodeLokasi?.message}
        />

        <SelectField
          mode="single"
          label="Kode Cabrera"
          value={watchedKodeCabang}
          options={CABANG_OPTIONS}
          onChange={(val) => setValue('kodeCabang', val || '')}
          placeholder="Pilih kode cabang"
          required
          disabled={isSubmitting}
          error={errors.kodeCabang?.message}
        />

        <InputField
          {...register('namaLokasi')}
          label="Nama Lokasi"
          placeholder="Contoh: Warehouse Jakarta Utama"
          required
          disabled={isSubmitting}
          error={errors.namaLokasi?.message}
        />

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}