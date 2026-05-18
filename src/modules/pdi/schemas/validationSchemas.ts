import { z } from "zod";

export const pdiChecklistItemSchema = z.object({
  id: z.string(),
  namaItem: z.string(),
  status: z.enum(["OK", "NOT_OK"]),
  notes: z.string().optional(),
});

export const pdiKsuItemSchema = z.object({
  id: z.string().optional(),
  namaItem: z.string().min(1, "Nama item wajib diisi"),
  jumlah: z.number().min(1, "Jumlah minimal 1"),
  kondisi: z.enum(["BAIK", "DAMAGE", "RUSAK"]),
  isSaved: z.boolean().optional(),
});

export const pdiHadiahItemSchema = z.object({
  id: z.string().optional(),
  namaHadiah: z.string().min(1, "Nama hadiah wajib diisi"),
  jumlah: z.number().min(1, "Jumlah minimal 1"),
  keterangan: z.string().optional(),
  isSaved: z.boolean().optional(),
});

export const pdiBarangLainItemSchema = z.object({
  id: z.string().optional(),
  namaBarang: z.string().min(1, "Nama barang wajib diisi"),
  jumlah: z.number().min(1, "Jumlah minimal 1"),
  keterangan: z.string().optional(),
  isSaved: z.boolean().optional(),
});

export const pdiPartItemSchema = z.object({
  id: z.string().optional(),
  namaPart: z.string().min(1, "Nama part wajib diisi"),
  jumlah: z.number().min(1, "Jumlah minimal 1"),
  kondisi: z.enum(["BAIK", "DAMAGE", "RUSAK"]),
  keterangan: z.string().optional(),
  isSaved: z.boolean().optional(),
});

export const pdiPhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  kategori: z.enum(["EXTERIOR", "INTERIOR", "DAMAGE", "LAINNYA"]),
  createdAt: z.string(),
});

export const pdiFormSchema = z.object({
  checklist: z.array(pdiChecklistItemSchema),
  ksu: z.array(pdiKsuItemSchema),
  hadiah: z.array(pdiHadiahItemSchema),
  barangLain: z.array(pdiBarangLainItemSchema),
  parts: z.array(pdiPartItemSchema),
  photos: z.array(pdiPhotoSchema),
});

export type PdiFormData = z.infer<typeof pdiFormSchema>;
export type PdiKsuFormItem = z.infer<typeof pdiKsuItemSchema>;
export type PdiHadiahFormItem = z.infer<typeof pdiHadiahItemSchema>;
export type PdiBarangLainFormItem = z.infer<typeof pdiBarangLainItemSchema>;
export type PdiPartFormItem = z.infer<typeof pdiPartItemSchema>;
export type PdiChecklistFormItem = z.infer<typeof pdiChecklistItemSchema>;
export type PdiPhotoFormItem = z.infer<typeof pdiPhotoSchema>;
