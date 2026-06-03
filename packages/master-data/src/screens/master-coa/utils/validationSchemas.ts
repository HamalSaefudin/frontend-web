import { z } from 'zod';

export const transactionSchema = z.object({
  transactionName: z.string().min(1, 'Nama transaksi wajib diisi'),
  category: z.enum(['TRX_IN', 'TRX_OUT'], {
    message: 'Kategori wajib dipilih',
  }),
  subgroup: z.string().optional(),
  group: z.string().optional(),
  isSaved: z.boolean(),
});

export const masterCoaCreateSchema = z.object({
  coaName: z
    .string()
    .min(1, 'Nama COA wajib diisi')
    .max(255, 'Nama COA maksimal 255 karakter'),
  branches: z
    .array(z.string())
    .min(1, 'Pilih minimal satu cabang'),
  statusActive: z.boolean(),
  transactions: z.array(transactionSchema),
});

export const masterCoaUpdateSchema = z.object({
  coaName: z
    .string()
    .min(1, 'Nama COA wajib diisi')
    .max(255, 'Nama COA maksimal 255 karakter'),
  branches: z
    .array(z.string())
    .min(1, 'Pilih minimal satu cabang'),
  statusActive: z.boolean(),
  transactions: z.array(transactionSchema),
});

export const copyMasterCoaSchema = z.object({
  branches: z
    .array(z.string())
    .min(1, 'Pilih minimal satu cabang'),
});

export type MasterCoaCreateFormData = z.infer<typeof masterCoaCreateSchema>;
export type MasterCoaUpdateFormData = z.infer<typeof masterCoaUpdateSchema>;
export type CopyMasterCoaFormData = z.infer<typeof copyMasterCoaSchema>;