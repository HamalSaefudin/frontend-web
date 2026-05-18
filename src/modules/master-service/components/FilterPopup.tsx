import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { filterServiceSchema, type FilterServiceInput } from '../schemas/validationSchemas';

export interface FilterCriteria {
  kodeJasa?: string;
  namaJasa?: string;
  servisCategory?: string;
  namaVarian?: string;
}

interface FilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (criteria: FilterCriteria) => void;
  onClear: () => void;
}

export function FilterPopup({
  open,
  onOpenChange,
  onApply,
  onClear,
}: FilterPopupProps) {
  const { register, handleSubmit, reset } = useForm<FilterServiceInput>({
    resolver: zodResolver(filterServiceSchema),
    defaultValues: {
      kodeJasa: '',
      namaJasa: '',
      servisCategory: '',
      namaVarian: '',
    },
  });

  const onFormSubmit = (data: FilterServiceInput) => {
    const criteria: FilterCriteria = {
      kodeJasa: data.kodeJasa || undefined,
      namaJasa: data.namaJasa || undefined,
      servisCategory: data.servisCategory || undefined,
      namaVarian: data.namaVarian || undefined,
    };
    onApply(criteria);
    onOpenChange(false);
  };

  const handleClear = () => {
    reset();
    onClear();
    onOpenChange(false);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTitle>Filter Services</AlertDialogTitle>
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
              placeholder="Search by service code..."
            />

            <InputField
              {...register('namaJasa')}
              label="Nama Jasa"
              placeholder="Search by service name..."
            />

            <InputField
              {...register('servisCategory')}
              label="Servis Category"
              placeholder="Search by category..."
            />

            <InputField
              {...register('namaVarian')}
              label="Nama Varian"
              placeholder="Search by variant name..."
            />

            <div className="flex gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </form>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
