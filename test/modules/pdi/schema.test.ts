import { describe, expect, it } from 'vitest'
import {
  pdiKsuItemSchema,
  pdiHadiahItemSchema,
  pdiBarangLainItemSchema,
  pdiPartItemSchema,
  pdiChecklistItemSchema,
  pdiFormSchema,
} from '@/modules/pdi/schemas/validationSchemas'

describe('PDI schema — pdiKsuItemSchema', () => {
  it('accepts valid item', () => {
    const result = pdiKsuItemSchema.safeParse({
      id: 'ksu-1',
      namaItem: 'Helm',
      jumlah: 2,
      kondisi: 'BAIK',
      isSaved: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty namaItem', () => {
    const result = pdiKsuItemSchema.safeParse({
      namaItem: '',
      jumlah: 1,
      kondisi: 'BAIK',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Nama item wajib diisi')
    }
  })

  it('rejects jumlah < 1', () => {
    const result = pdiKsuItemSchema.safeParse({
      namaItem: 'Helm',
      jumlah: 0,
      kondisi: 'BAIK',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid kondisi', () => {
    const result = pdiKsuItemSchema.safeParse({
      namaItem: 'Helm',
      jumlah: 1,
      kondisi: 'INVALID',
    })
    expect(result.success).toBe(false)
  })

  it('treats id and isSaved as optional', () => {
    const result = pdiKsuItemSchema.safeParse({
      namaItem: 'Helm',
      jumlah: 1,
      kondisi: 'BAIK',
    })
    expect(result.success).toBe(true)
  })
})

describe('PDI schema — pdiHadiahItemSchema', () => {
  it('accepts valid item without keterangan', () => {
    const result = pdiHadiahItemSchema.safeParse({
      namaHadiah: 'Jaket',
      jumlah: 1,
      kondisi: 'BAIK',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty namaHadiah', () => {
    const result = pdiHadiahItemSchema.safeParse({
      namaHadiah: '',
      jumlah: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe('PDI schema — pdiBarangLainItemSchema', () => {
  it('accepts valid item', () => {
    const result = pdiBarangLainItemSchema.safeParse({
      namaBarang: 'Kunci serep',
      jumlah: 1,
      keterangan: 'extra',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty namaBarang', () => {
    const result = pdiBarangLainItemSchema.safeParse({
      namaBarang: '',
      jumlah: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe('PDI schema — pdiPartItemSchema', () => {
  it('accepts all kondisi enum values', () => {
    for (const kondisi of ['BAIK', 'DAMAGE', 'RUSAK'] as const) {
      const result = pdiPartItemSchema.safeParse({
        namaPart: 'Filter oli',
        jumlah: 1,
        kondisi,
      })
      expect(result.success).toBe(true)
    }
  })
})

describe('PDI schema — pdiChecklistItemSchema', () => {
  it('accepts OK status', () => {
    const result = pdiChecklistItemSchema.safeParse({
      id: 'c-1',
      namaItem: 'Lampu depan',
      status: 'OK',
    })
    expect(result.success).toBe(true)
  })

  it('accepts NOT_OK status with notes', () => {
    const result = pdiChecklistItemSchema.safeParse({
      id: 'c-2',
      namaItem: 'Spion',
      status: 'NOT_OK',
      notes: 'retak',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid status', () => {
    const result = pdiChecklistItemSchema.safeParse({
      id: 'c-3',
      namaItem: 'Klakson',
      status: 'MAYBE',
    })
    expect(result.success).toBe(false)
  })
})

describe('PDI schema — pdiFormSchema', () => {
  it('accepts a fully empty form', () => {
    const result = pdiFormSchema.safeParse({
      checklist: [],
      ksu: [],
      hadiah: [],
      barangLain: [],
      parts: [],
      photos: [],
    })
    expect(result.success).toBe(true)
  })

  it('aggregates errors from nested arrays', () => {
    const result = pdiFormSchema.safeParse({
      checklist: [],
      ksu: [{ namaItem: '', jumlah: 1, kondisi: 'BAIK' }],
      hadiah: [],
      barangLain: [],
      parts: [],
      photos: [],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const ksuError = result.error.issues.find((i) =>
        i.path.join('.').startsWith('ksu.0.namaItem'),
      )
      expect(ksuError).toBeDefined()
    }
  })
})
