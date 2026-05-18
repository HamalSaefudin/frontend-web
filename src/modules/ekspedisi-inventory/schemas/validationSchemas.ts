import { z } from "zod";
import type {
  EkspedisiInventoryProcessFormValues,
  KsuRowFormValues,
} from "../types";

export const ekspedisiInventoryFiltersSchema = z.object({
  status: z.union([z.literal(""), z.literal("DRAFT"), z.literal("PROCESSED"), z.literal("CANCELLED")]).optional().default(""),
  keyword: z.string().optional().default(""),
});

export const ksuRowSchema = z.object({
  kodeKsu: z.string().trim().min(1, "Kode KSU wajib diisi"),
  namaKsu: z.string().optional(),
  jenisKsu: z.string().optional(),
  qrCode: z.string().optional(),
  scan: z.boolean(),
  menyusul: z.boolean(),
}).superRefine((row, ctx) => {
  // Business rule:
  // - When Menyusul is false, Scan must be checked.
  if (!row.menyusul && !row.scan) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["scan"],
      message: "Scan wajib jika Menyusul = false",
    });
  }
});

export const ekspedisiInventoryProcessSchema = z
  .object({
    cabang: z.string().trim().min(1, "Cabang wajib diisi"),
    tipeUnit: z.string().trim().min(1, "Tipe Unit wajib diisi"),
    noFJ: z.string().trim().min(1, "No FJ wajib diisi"),
    noPDI: z.string().trim().min(1, "No PDI wajib diisi"),
    warnaUnit: z.string().trim().min(1, "Warna Unit wajib diisi"),
    noRangka: z.string().trim().min(1, "No Rangka wajib diisi"),
    noEkspedisi: z.string().trim().min(1, "No Ekspedisi wajib diisi"),
    noMesin: z.string().trim().min(1, "No Mesin wajib diisi"),
    namaPembeli: z.string().trim().min(1, "Nama Pembeli wajib diisi"),
    items: z.array(ksuRowSchema).min(1, "Minimal 1 KSU dibutuhkan"),
  })
  .superRefine((values, ctx) => {
    const normalized = values.items.map((i) => i.kodeKsu.trim().toLowerCase());
    const counts = new Map<string, number>();
    normalized.forEach((k) => counts.set(k, (counts.get(k) ?? 0) + 1));

    normalized.forEach((k, idx) => {
      if ((counts.get(k) ?? 0) > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["items", idx, "kodeKsu"],
          message: "Kode KSU tidak boleh duplicate",
        });
      }
    });
  });

export type EkspedisiInventoryFilters = z.infer<typeof ekspedisiInventoryFiltersSchema>;
export type KsuRowFormSchemaValues = z.infer<typeof ksuRowSchema>;
export type EkspedisiInventoryProcessSchemaValues = z.infer<typeof ekspedisiInventoryProcessSchema>;

// Ensure exported types match the module types used by the form.
export type EkspedisiInventoryProcessFormValuesShim = EkspedisiInventoryProcessFormValues;
export type KsuRowFormValuesShim = KsuRowFormValues;