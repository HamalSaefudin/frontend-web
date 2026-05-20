import { z } from 'zod';

export const masterCoaCreateSchema = z.object({
  coaName: z
    .string()
    .min(1, 'Nama COA wajib diisi')
    .max(255, 'Nama COA maksimal 255 karakter'),
  branches: z
    .array(z.string())
    .min(1, 'Pilih minimal satu cabang'),
  statusActive: z.boolean(),
  transactions: z
    .array(
      z.object({
        transactionName: z.string().min(1, 'Nama transaksi wajib diisi'),
        category: z.enum(['TRX_IN', 'TRX_OUT'], {
          message: 'Kategori wajib dipilih',
        }),
        subgroup: z.string().min(1, 'Subgrup wajib diisi'),
        group: z.string().min(1, 'Grup wajib diisi'),
        isSaved: z.boolean().default(true),
      })
    )
    .optional()
    .default([]),
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
});

export const copyMasterCoaSchema = z.object({
  branches: z
    .array(z.string())
    .min(1, 'Pilih minimal satu cabang'),
});

export type MasterCoaCreateFormData = z.infer<typeof masterCoaCreateSchema>;
export type MasterCoaUpdateFormData = z.infer<typeof masterCoaUpdateSchema>;
export type CopyMasterCoaFormData = z.infer<typeof copyMasterCoaSchema>;