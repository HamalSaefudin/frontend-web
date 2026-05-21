import { z } from 'zod';

export const lokasiFormSchema = z.object({
  kodeLokasi: z.string().min(1, 'Kode lokasi wajib diisi').max(50, 'Maksimal 50 karakter'),
  kodeCabang: z.string().min(1, 'Kode cabang wajib diisi'),
  namaLokasi: z.string().min(1, 'Nama lokasi wajib diisi').max(255, 'Maksimal 255 karakter'),
});

export type LokasiFormInput = z.infer<typeof lokasiFormSchema>;

export const lokasiFilterSchema = z.object({
  kodeLokasi: z.string().optional(),
  kodeCabang: z.string().optional(),
  namaLokasi: z.string().optional(),
});

export type LokasiFilterInput = z.infer<typeof lokasiFilterSchema>;