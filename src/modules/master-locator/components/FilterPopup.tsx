import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppModal } from '@/components/AppModal';
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { lokasiFilterSchema, type LokasiFilterInput } from '../utils/validationSchemas';
import { SearchIcon } from 'lucide-react';

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
  const { register, handleSubmit, reset } = useForm<LokasiFilterInput>({
    resolver: zodResolver(lokasiFilterSchema),
    defaultValues: {
      kodeLokasi: '',
      kodeCabang: '',
      namaLokasi: '',
    },
  });

  const onSubmit = (data: LokasiFilterInput) => {
    // Only pass non-empty values
    const filters: LokasiFilterInput = {};
    if (data.kodeLokasi?.trim()) filters.kodeLokasi = `%${data.kodeLokasi.trim()}%`;
    if (data.kodeCabang?.trim()) filters.kodeCabang = `%${data.kodeCabang.trim()}%`;
    if (data.namaLokasi?.trim()) filters.namaLokasi = `%${data.namaLokasi.trim()}%`;
    
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
          placeholder="Cari kode lokasi..."
        />

        <InputField
          {...register('kodeCabang')}
          label="Kode Cabrera"
          placeholder="Cari kode cabang..."
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