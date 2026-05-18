import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Service } from '../hooks/useServiceData';
import { serviceFormSchema, type ServiceFormInput } from '../schemas/validationSchemas';
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (service: Omit<Service, 'id'>) => Promise<void>;
  initialData?: Service;
}

export function ServiceForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      kodeJasa: initialData?.kodeJasa || '',
      namaJasa: initialData?.namaJasa || '',
      servisCategory: initialData?.servisCategory || '',
      kodeHarian: initialData?.kodeHarian || '',
      namaVarian: initialData?.namaVarian || '',
      kodeVarian: initialData?.kodeVarian || '',
      branchId: initialData?.branchId || '',
    },
  });

  const onFormSubmit = async (data: ServiceFormInput) => {
    try {
      await onSubmit({
        kodeJasa: data.kodeJasa,
        namaJasa: data.namaJasa,
        servisCategory: data.servisCategory,
        kodeHarian: data.kodeHarian,
        namaVarian: data.namaVarian,
        kodeVarian: data.kodeVarian,
        branchId: data.branchId || '',
      });
      reset();
      onOpenChange(false);
    } catch {
      // Error is handled by the parent component
    }
  };

  const handleReset = () => {
    reset({
      kodeJasa: initialData?.kodeJasa || '',
      namaJasa: initialData?.namaJasa || '',
      servisCategory: initialData?.servisCategory || '',
      kodeHarian: initialData?.kodeHarian || '',
      namaVarian: initialData?.namaVarian || '',
      kodeVarian: initialData?.kodeVarian || '',
      branchId: initialData?.branchId || '',
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTitle>
            {initialData ? 'Edit Service' : 'Create New Service'}
          </AlertDialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <AlertDialogDescription>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <InputField
              {...register('kodeJasa')}
              label="Kode Jasa"
              placeholder="Enter service code..."
              required
              error={errors.kodeJasa?.message}
              disabled={isSubmitting}
            />

            <InputField
              {...register('namaJasa')}
              label="Nama Jasa"
              placeholder="Enter service name..."
              required
              error={errors.namaJasa?.message}
              disabled={isSubmitting}
            />

            <InputField
              {...register('servisCategory')}
              label="Servis Category"
              placeholder="Enter category..."
              required
              error={errors.servisCategory?.message}
              disabled={isSubmitting}
            />

            <InputField
              {...register('kodeHarian')}
              label="Kode Harian"
              placeholder="Enter daily code..."
              required
              error={errors.kodeHarian?.message}
              disabled={isSubmitting}
            />

            <InputField
              {...register('namaVarian')}
              label="Nama Varian"
              placeholder="Enter variant name..."
              required
              error={errors.namaVarian?.message}
              disabled={isSubmitting}
            />

            <InputField
              {...register('kodeVarian')}
              label="Kode Varian"
              placeholder="Enter variant code..."
              required
              error={errors.kodeVarian?.message}
              disabled={isSubmitting}
            />

            <div className="flex gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
