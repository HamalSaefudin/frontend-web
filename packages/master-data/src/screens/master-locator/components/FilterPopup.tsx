import { InputField, SelectField, Button, AppModal } from '@frontend/ui'
import { useForm } from 'react-hook-form';
import { lokasiFilterSchema, type LokasiFilterInput } from '../utils/validationSchemas';
import { SearchIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchBranches, type Branch } from '../../../services/master-cabang';
import { zodResolver } from "@hookform/resolvers/zod";

interface FilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: LokasiFilterInput) => void;
  onClear: () => void;
}

export function FilterPopup({
  open,
  onOpenChange,
  onApply,
  onClear,
}: FilterPopupProps) {
  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches', 'filter'],
    queryFn: async () => {
      const response = await fetchBranches();
      return response?.data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm<LokasiFilterInput>({
    resolver: zodResolver(lokasiFilterSchema),
    defaultValues: {
      kodeLokasi: '',
      kodeCabang: '',
      namaLokasi: '',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedCabang = watch('kodeCabang');

  const onSubmit = (data: LokasiFilterInput) => {
    // Pass values directly - user can type wildcards manually if needed
    const filters: LokasiFilterInput = {};
    if (data.kodeLokasi?.trim()) filters.kodeLokasi = data.kodeLokasi.trim();
    if (data.kodeCabang?.trim()) filters.kodeCabang = data.kodeCabang.trim();
    if (data.namaLokasi?.trim()) filters.namaLokasi = data.namaLokasi.trim();
    
    onApply(filters);
    onOpenChange(false);
  };

  const handleClear = () => {
    reset({
      kodeLokasi: '',
      kodeCabang: '',
      namaLokasi: '',
    });
    onClear();
    onOpenChange(false);
  };

  const cabangOptions: Array<{ value: string; label: string }> = [
    { value: '', label: 'Semua Cabrera' },
    ...branches.map((branch: Branch) => ({
      value: branch.kodeCabang,
      label: `${branch.kodeCabang} - ${branch.namaCabang}`,
    })),
  ];

  return (
    <AppModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Filter Lokasi Warehouse"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          {...register('kodeLokasi')}
          label="Kode Lokasi"
          placeholder="Contoh: WH% atau WH-JKT"
        />

        <SelectField
          label="Kode Cabrera"
          value={selectedCabang || ''}
          onChange={(val: string) => setValue('kodeCabang', val)}
          options={cabangOptions}
          placeholder="Semua Cabrera"
        />

        <InputField
          {...register('namaLokasi')}
          label="Nama Lokasi"
          placeholder="Cari nama lokasi..."
        />

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
          >
            Hapus
          </Button>
          <Button type="submit">
            <SearchIcon className="size-4 mr-2" />
            Terapkan
          </Button>
        </div>
      </form>
    </AppModal>
  );
}