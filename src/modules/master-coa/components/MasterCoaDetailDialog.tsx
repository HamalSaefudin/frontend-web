import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { AppModal } from '@/components/AppModal';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { DataTable } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useQueryMasterCoaDetail, useQueryCabang } from '../hooks';
import type { CoaTransaction } from '@/services/master-coa';
import { formatBranchCodes } from '../utils/branchLabelMap';

interface MasterCoaDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coaId: string | null;
  onEdit?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onDelete?: () => void;
}

function CoaDetailActions({
  status,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  onClose,
}: {
  status: string;
  onEdit?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-end pt-2 border-t">
      <Button type="button" variant="outline" onClick={onClose}>
        Tutup
      </Button>
      {onEdit && (
        <Button type="button" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      )}
      {status === 'INACTIVE' && onActivate && (
        <Button type="button" onClick={onActivate}>
          Aktifkan
        </Button>
      )}
      {status === 'ACTIVE' && onDeactivate && (
        <Button type="button" variant="outline" onClick={onDeactivate}>
          Nonaktifkan
        </Button>
      )}
      {onDelete && (
        <Button type="button" variant="destructive" onClick={onDelete}>
          Hapus
        </Button>
      )}
    </div>
  );
}

export function MasterCoaDetailDialog({
  open,
  onOpenChange,
  coaId,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
}: MasterCoaDetailDialogProps) {
  const { data: response, isLoading } = useQueryMasterCoaDetail(coaId ?? '');
  const { data: cabangList = [] } = useQueryCabang();
  const coa = response?.data;

  const transactionColumns: ColumnDef<CoaTransaction>[] = useMemo(
    () => [
      { accessorKey: 'transactionId', header: 'ID Transaksi', meta: { className: 'min-w-32' } },
      { accessorKey: 'transactionName', header: 'Nama Transaksi', meta: { className: 'min-w-40' } },
      {
        accessorKey: 'category',
        header: 'Kategori',
        cell: ({ getValue }) => (getValue() === 'TRX_IN' ? 'Masuk' : 'Keluar'),
        meta: { className: 'min-w-24' },
      },
      { accessorKey: 'subgroup', header: 'Subgrup', meta: { className: 'min-w-28' } },
      { accessorKey: 'group', header: 'Grup', meta: { className: 'min-w-28' } },
      { accessorKey: 'status', header: 'Status', meta: { className: 'min-w-20' } },
    ],
    [],
  );

  return (
    <AppModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={coa ? `Detail COA — ${coa.coaId}` : 'Detail COA'}
      className="max-w-4xl"
    >
      {isLoading ? (
        <LoadingOverlay message="Memuat detail COA..." />
      ) : !coa ? (
        <p className="text-sm text-muted-foreground">Data COA tidak ditemukan.</p>
      ) : (
        <div className="space-y-6">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">ID COA</dt>
              <dd className="font-medium">{coa.coaId}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Nama COA</dt>
              <dd className="font-medium">{coa.coaName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium">{coa.status}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Cabang</dt>
              <dd className="font-medium">{formatBranchCodes(coa.branches, cabangList)}</dd>
            </div>
          </dl>

          <div>
            <h3 className="text-sm font-semibold mb-2">Jenis Transaksi</h3>
            {coa.transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada jenis transaksi.</p>
            ) : (
              <DataTable columns={transactionColumns} data={coa.transactions} />
            )}
          </div>

          <CoaDetailActions
            status={coa.status}
            onEdit={onEdit}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onDelete={onDelete}
            onClose={() => onOpenChange(false)}
          />
        </div>
      )}
    </AppModal>
  );
}

