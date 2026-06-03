import { InputField, Button, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@frontend/ui'
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { BranchFilterCriteria } from '../utils/filterBranches';
import { filterBranchesSchema, type FilterBranchesInput } from '../utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';

interface FilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (criteria: BranchFilterCriteria) => void;
  onClear: () => void;
}

export function FilterPopup({
  open,
  onOpenChange,
  onApply,
  onClear,
}: FilterPopupProps) {
  const { register, handleSubmit, reset } = useForm<FilterBranchesInput>({
    resolver: zodResolver(filterBranchesSchema),
    defaultValues: {
      kodeCabang: '',
      namaCabang: '',
      namaLead: '',
    },
  });

  const onFormSubmit = (data: FilterBranchesInput) => {
    const criteria: BranchFilterCriteria = {
      kodeCabang: data.kodeCabang || undefined,
      namaCabang: data.namaCabang || undefined,
      namaLead: data.namaLead || undefined,
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
          <AlertDialogTitle>Filter Branches</AlertDialogTitle>
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
              {...register('kodeCabang')}
              label="Kode Cabang"
              placeholder="Search by branch code..."
            />

            <InputField
              {...register('namaCabang')}
              label="Nama Cabang"
              placeholder="Search by branch name..."
            />

            <InputField
              {...register('namaLead')}
              label="Nama Leader"
              placeholder="Search by leader name..."
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
