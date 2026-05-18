import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Branch } from '../hooks';
import { branchFormSchema, type BranchFormInput } from '../utils/validationSchemas';
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';

interface BranchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (branch: Omit<Branch, 'id'>) => Promise<void>;
  initialData?: Branch;
}

export function BranchForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: BranchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BranchFormInput>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      kodeCabang: initialData?.kodeCabang || '',
      namaCabang: initialData?.namaCabang || '',
      namaLead: initialData?.namaLead || '',
    },
  });

  const onFormSubmit = async (data: BranchFormInput) => {
    try {
      await onSubmit({
        kodeCabang: data.kodeCabang,
        namaCabang: data.namaCabang,
        namaLead: data.namaLead,
      });
      reset();
      onOpenChange(false);
    } catch {
      // Error is handled by the parent component
    }
  };

  const handleReset = () => {
    reset({
      kodeCabang: initialData?.kodeCabang || '',
      namaCabang: initialData?.namaCabang || '',
      namaLead: initialData?.namaLead || '',
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTitle>
            {initialData ? 'Edit Branch' : 'Create New Branch'}
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
              {...register('kodeCabang')}
              label="Kode Cabang"
              placeholder="Enter branch code..."
              required
              error={errors.kodeCabang?.message}
              disabled={isSubmitting}
            />

            <InputField
              {...register('namaCabang')}
              label="Nama Cabang"
              placeholder="Enter branch name..."
              required
              error={errors.namaCabang?.message}
              disabled={isSubmitting}
            />

            <InputField
              {...register('namaLead')}
              label="Nama Leader"
              placeholder="Enter leader name..."
              required
              error={errors.namaLead?.message}
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
