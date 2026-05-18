import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppModal } from "@/components/AppModal";
import { InputField } from "@/components/ui/input-field";
import { SelectField, type SelectOption } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQueryCabang } from "../hooks";

// Filter validation schema
const filterSchema = z.object({
  kodeKas: z.string().optional(),
  namaCabang: z.string().optional(),
  namaKas: z.string().optional(),
  status: z.string().optional(),
});

type FilterInput = z.infer<typeof filterSchema>;

export interface MasterKasFilterCriteria {
  kodeKas?: string;
  namaCabang?: string;
  namaKas?: string;
  status?: boolean;
}

interface FilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (criteria: MasterKasFilterCriteria) => void;
  onClear: () => void;
}

export function FilterPopup({
  open,
  onOpenChange,
  onApply,
  onClear,
}: FilterPopupProps) {
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<FilterInput>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      kodeKas: "",
      namaCabang: "",
      namaKas: "",
      status: "",
    },
  });

  const { data: cabangData } = useQueryCabang();

  const onFormSubmit = (data: FilterInput) => {
    const criteria: MasterKasFilterCriteria = {
      kodeKas: data.kodeKas || undefined,
      namaCabang: data.namaCabang || undefined,
      namaKas: data.namaKas || undefined,
      status: data.status === "true" ? true : data.status === "false" ? false : undefined,
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

  const statusOptions: SelectOption[] = [
    { value: "", label: "Semua" },
    { value: "true", label: "Aktif" },
    { value: "false", label: "Nonaktif" },
  ];

  const cabangOptions: SelectOption[] = [
    { value: "", label: "Semua" },
    ...(cabangData || []).map((c) => ({
      value: c.namaCabang,
      label: c.namaCabang,
    })),
  ];

  return (
    <AppModal isOpen={open} onClose={() => onOpenChange(false)} title="Filter Data Kas">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Controller
          name="kodeKas"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              label="Kode Kas"
              placeholder="Cari kode kas..."
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
              placeholder="Cari nama kas..."
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectField
              {...field}
              label="Status"
              options={statusOptions}
            />
          )}
        />

        <div className="flex gap-2 pt-4 border-t">
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
            Hapus
          </Button>
          <Button type="submit" className="flex-1">
            Terapkan
          </Button>
        </div>
      </form>
    </AppModal>
  );
}