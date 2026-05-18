import { z } from 'zod'

export const branchFormSchema = z.object({
  kodeCabang: z.string().min(1, 'Kode Cabang is required').trim(),
  namaCabang: z.string().min(1, 'Nama Cabang is required').trim(),
  namaLead: z.string().min(1, 'Nama Leader is required').trim(),
})

export const filterBranchesSchema = z.object({
  kodeCabang: z.string().optional().nullable(),
  namaCabang: z.string().optional().nullable(),
  namaLead: z.string().optional().nullable(),
})

export type BranchFormInput = z.infer<typeof branchFormSchema>
export type FilterBranchesInput = z.infer<typeof filterBranchesSchema>
