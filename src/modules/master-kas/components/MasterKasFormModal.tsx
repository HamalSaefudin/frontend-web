import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { MasterKas } from "../hooks";
import { useQueryCabang } from "../hooks";
import { AppModal } from "@/components/AppModal";
import { InputField } from "@/components/ui/input-field";
import { SelectField, type SelectOption } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/LoadingOverlay";

// Form validation schema
const masterKasSchema = z.object({
  kodeKas: z.string().min(1, "Kode Kas wajib diisi"),
  namaCabang: z.string().min(1, "Nama Cabrera wajib diisi"),
  namaKas: z.string().min(1, "Nama Kas wajib diisi"),
  status: z.boolean(),
});

type MasterKasFormInput = z.infer<typeof masterKasSchema>;

interface MasterKasFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (kas: Omit<MasterKas, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  initialData?: MasterKas;
  isLoading?: boolean;
}

export function MasterKasFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: MasterKasFormModalProps) {
  const isEditMode = !!initialData;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<MasterKasFormInput>({
    resolver: zodResolver(masterKasSchema),
    defaultValues: {
      kodeKas: "",
      namaCabang: "",
      namaKas: "",
      status: false,
    },
  });

  const { data: cabangData } = useQueryCabang();

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setValue("kodeKas", initialData.kodeKas);
        setValue("namaCabang", initialData.namaCabang);
        setValue("namaKas", initialData.namaKas);
        setValue("status", initialData.status);
      } else {
        reset({
          kodeKas: "",
          namaCabang: "",
          namaKas: "",
          status: false,
        });
      }
    }
  }, [open, initialData, reset, setValue]);

  const onFormSubmit = async (data: MasterKasFormInput) => {
    try {
      await onSubmit({
        kodeKas: data.kodeKas,
        namaCabang: data.namaCabang,
        namaKas: data.namaKas,
        status: data.status,
      });
      onOpenChange(false);
    } catch {
      // Error handled by parent
    }
  };

  // Convert cabang data to SelectOptions
  const cabangOptions: SelectOption[] = (cabangData || []).map((c) => ({
    value: c.namaCabang,
    label: c.namaCabang,
  }));

  const getTitle = () => {
    if (isEditMode) return "Edit Data Kas";
    return "Tambah Data Kas";
  };

  return (
    <AppModal isOpen={open} onClose={() => onOpenChange(false)} title={getTitle()}>
      {isLoading ? (
        <LoadingOverlay message="Memuat data..." />
      ) : (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Controller
            name="kodeKas"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Kode Kas"
                placeholder="Masukkan kode kas..."
                required
                error={errors.kodeKas?.message}
                disabled={isEditMode || isSubmitting}
              />
            )}
          />

          <Controller
            name="namaCabang"
            control={control}
            render={({ field }) => (
              <SelectField
                {...field}
                label="Nama Cabrera"
                placeholder="Pilih cabang..."
                options={cabangOptions}
                required
                error={errors.namaCabang?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="namaKas"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Nama Kas"
                placeholder="Masukkan nama kas..."
                required
                error={errors.namaKas?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Status Aktif</label>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </div>
            )}
          />

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      )}
    </AppModal>
  );
}