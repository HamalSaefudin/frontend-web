import { Button, SelectField, type SelectOption, AppModal } from '@frontend/ui'
import { useEffect, useMemo } from 'react';
import { copyMasterCoaSchema, type CopyMasterCoaFormData } from '../utils/validationSchemas';
import type { MasterCoa } from '../../../services/master-coa';
import { useQueryCabang } from '../hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

interface MasterCoaCopyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: MasterCoa | null;
  onSubmit: (data: CopyMasterCoaFormData) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string;
}

export function MasterCoaCopyDialog({
  open,
  onOpenChange,
  source,
  onSubmit,
  isLoading,
  errorMessage,
}: MasterCoaCopyDialogProps) {
  const { data: cabangData = [], isLoading: cabangLoading } = useQueryCabang();

  const branchOptions: SelectOption[] = useMemo(
    () => cabangData.map((c) => ({ value: c.kodeCabang, label: c.namaCabang })),
    [cabangData],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CopyMasterCoaFormData>({
    resolver: zodResolver(copyMasterCoaSchema),
    defaultValues: { branches: [] },
  });

  useEffect(() => {
    if (open) {
      reset({ branches: [] });
    }
  }, [open, reset]);

  return (
    <AppModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={`Salin COA — ${source?.coaId ?? ''}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Pilih cabang untuk COA baru yang disalin dari &quot;{source?.coaName}&quot;.
        </p>

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

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

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
            {isSubmitting || isLoading ? 'Memproses...' : 'Salin'}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}
