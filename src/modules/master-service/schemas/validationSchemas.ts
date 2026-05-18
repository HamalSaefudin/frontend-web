import { z } from 'zod'

export const serviceFormSchema = z.object({
  kodeJasa: z.string().min(1, 'Kode Jasa is required').trim(),
  namaJasa: z.string().min(1, 'Nama Jasa is required').trim(),
  servisCategory: z.string().min(1, 'Servis Category is required').trim(),
  kodeHarian: z.string().min(1, 'Kode Harian is required').trim(),
  namaVarian: z.string().min(1, 'Nama Varian is required').trim(),
  kodeVarian: z.string().min(1, 'Kode Varian is required').trim(),
  branchId: z.string().optional().nullable(),
})

export const filterServiceSchema = z.object({
  kodeJasa: z.string().optional().nullable(),
  namaJasa: z.string().optional().nullable(),
  servisCategory: z.string().optional().nullable(),
  namaVarian: z.string().optional().nullable(),
})

export type ServiceFormInput = z.infer<typeof serviceFormSchema>
export type FilterServiceInput = z.infer<typeof filterServiceSchema>
