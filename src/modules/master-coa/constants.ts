export const COA_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'TRX_IN', label: 'Transaksi Masuk' },
  { value: 'TRX_OUT', label: 'Transaksi Keluar' },
];

export const COA_STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'INACTIVE', label: 'Nonaktif' },
] as const;
