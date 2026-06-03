import { AppModal, InputField, Button } from '@frontend/ui'
import type { LokasiWarehouse } from '../../../services/master-locator';
import dayjs from 'dayjs';

interface LokasiDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: LokasiWarehouse | null;
}

export function LokasiDetailModal({
  open,
  onOpenChange,
  data,
}: LokasiDetailModalProps) {
  if (!data) return null;

  const createdAt = data.createdAt ? dayjs(data.createdAt).format('DD/MM/YYYY HH:mm') : '-';
  const updatedAt = data.updatedAt ? dayjs(data.updatedAt).format('DD/MM/YYYY HH:mm') : '-';

  return (
    <AppModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Detail Lokasi Warehouse"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Kode Lokasi"
            value={data.kodeLokasi}
            disabled
          />
          <InputField
            label="Kode Cabrera"
            value={data.kodeCabang}
            disabled
          />
        </div>

        <InputField
          label="Nama Lokasi"
          value={data.namaLokasi}
          disabled
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Dibuat"
            value={createdAt}
            disabled
          />
          <InputField
            label="Diperbarui"
            value={updatedAt}
            disabled
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Tutup
        </Button>
      </div>
    </AppModal>
  );
}