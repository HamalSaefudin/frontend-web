import { describe, it, expect } from 'vitest'

// Form validation logic extracted for testing
const validateServiceForm = (data: {
  kodeJasa?: string
  namaJasa?: string
  servisCategory?: string
  kodeHarian?: string
  namaVarian?: string
  kodeVarian?: string
}): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!data.kodeJasa?.trim()) {
    errors.kodeJasa = 'Kode Jasa is required'
  }
  if (!data.namaJasa?.trim()) {
    errors.namaJasa = 'Nama Jasa is required'
  }
  if (!data.servisCategory?.trim()) {
    errors.servisCategory = 'Servis Category is required'
  }
  if (!data.kodeHarian?.trim()) {
    errors.kodeHarian = 'Kode Harian is required'
  }
  if (!data.namaVarian?.trim()) {
    errors.namaVarian = 'Nama Varian is required'
  }
  if (!data.kodeVarian?.trim()) {
    errors.kodeVarian = 'Kode Varian is required'
  }

  return errors
}

describe('Service Form Validation', () => {
  describe('required field validation', () => {
    it('should accept valid form data', () => {
      const data = {
        kodeJasa: 'JASA001',
        namaJasa: 'Service Name',
        servisCategory: 'Category',
        kodeHarian: 'HD001',
        namaVarian: 'Variant',
        kodeVarian: 'VAR001',
      }

      const errors = validateServiceForm(data)
      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('should reject empty kodeJasa', () => {
      const data = {
        kodeJasa: '',
        namaJasa: 'Name',
        servisCategory: 'Cat',
        kodeHarian: 'HD',
        namaVarian: 'Var',
        kodeVarian: 'VAR',
      }

      const errors = validateServiceForm(data)
      expect(errors.kodeJasa).toBeDefined()
      expect(errors.kodeJasa).toContain('required')
    })

    it('should reject whitespace-only fields', () => {
      const data = {
        kodeJasa: '   ',
        namaJasa: 'Name',
        servisCategory: 'Cat',
        kodeHarian: 'HD',
        namaVarian: 'Var',
        kodeVarian: 'VAR',
      }

      const errors = validateServiceForm(data)
      expect(errors.kodeJasa).toBeDefined()
    })

    it('should validate all required fields', () => {
      const data = {
        kodeJasa: '',
        namaJasa: '',
        servisCategory: '',
        kodeHarian: '',
        namaVarian: '',
        kodeVarian: '',
      }

      const errors = validateServiceForm(data)
      expect(Object.keys(errors)).toHaveLength(6)
    })

    it('should only report errors for empty fields', () => {
      const data = {
        kodeJasa: 'JASA001',
        namaJasa: '',
        servisCategory: 'Category',
        kodeHarian: 'HD001',
        namaVarian: '',
        kodeVarian: 'VAR001',
      }

      const errors = validateServiceForm(data)
      expect(errors.namaJasa).toBeDefined()
      expect(errors.namaVarian).toBeDefined()
      expect(errors.kodeJasa).toBeUndefined()
      expect(errors.servisCategory).toBeUndefined()
    })
  })

  describe('field-specific validation', () => {
    it('should accept various code formats', () => {
      const validCodes = ['JASA001', 'JAS-001', 'jasa_001', 'JASA']

      validCodes.forEach(code => {
        const data = {
          kodeJasa: code,
          namaJasa: 'Name',
          servisCategory: 'Cat',
          kodeHarian: 'HD',
          namaVarian: 'Var',
          kodeVarian: 'VAR',
        }
        const errors = validateServiceForm(data)
        expect(errors.kodeJasa).toBeUndefined()
      })
    })

    it('should accept long service names', () => {
      const longName = 'A'.repeat(100)
      const data = {
        kodeJasa: 'CODE',
        namaJasa: longName,
        servisCategory: 'Cat',
        kodeHarian: 'HD',
        namaVarian: 'Var',
        kodeVarian: 'VAR',
      }

      const errors = validateServiceForm(data)
      expect(errors.namaJasa).toBeUndefined()
    })
  })
})
