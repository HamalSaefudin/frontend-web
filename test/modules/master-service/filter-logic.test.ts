import { describe, it, expect } from 'vitest'
import type { Service } from '../../../src/services/master-service'

// Filter logic extracted for testing
const filterServices = (
  services: Service[],
  criteria: {
    kodeJasa?: string
    namaJasa?: string
    servisCategory?: string
    namaVarian?: string
  }
): Service[] => {
  return services.filter(service => {
    if (criteria.kodeJasa && !service.kodeJasa.toLowerCase().includes(criteria.kodeJasa.toLowerCase())) return false
    if (criteria.namaJasa && !service.namaJasa.toLowerCase().includes(criteria.namaJasa.toLowerCase())) return false
    if (criteria.servisCategory && !service.servisCategory.toLowerCase().includes(criteria.servisCategory.toLowerCase())) return false
    if (criteria.namaVarian && !service.namaVarian.toLowerCase().includes(criteria.namaVarian.toLowerCase())) return false
    return true
  })
}

const mockServices: Service[] = [
  {
    id: '1',
    kodeJasa: 'JASA001',
    namaJasa: 'Jasa Pengiriman Standard',
    servisCategory: 'Logistik',
    kodeHarian: 'HD001',
    namaVarian: 'Same Day',
    kodeVarian: 'VAR001',
    branchId: '1',
  },
  {
    id: '2',
    kodeJasa: 'JASA002',
    namaJasa: 'Jasa Pengiriman Express',
    servisCategory: 'Logistik',
    kodeHarian: 'HD002',
    namaVarian: 'Next Day',
    kodeVarian: 'VAR002',
    branchId: '1',
  },
  {
    id: '3',
    kodeJasa: 'JASA003',
    namaJasa: 'Jasa Konsultasi',
    servisCategory: 'Konsultasi',
    kodeHarian: 'HD003',
    namaVarian: 'Basic',
    kodeVarian: 'VAR003',
    branchId: '2',
  },
]

describe('Service Filter Logic', () => {
  describe('empty filters', () => {
    it('should return all services when no filters applied', () => {
      const result = filterServices(mockServices, {})
      expect(result).toHaveLength(3)
    })

    it('should return all services with undefined criteria', () => {
      const result = filterServices(mockServices, {
        kodeJasa: undefined,
        namaJasa: undefined,
      })
      expect(result).toHaveLength(3)
    })
  })

  describe('single filter', () => {
    it('should filter by kodeJasa', () => {
      const result = filterServices(mockServices, { kodeJasa: 'JASA001' })
      expect(result).toHaveLength(1)
      expect(result[0].kodeJasa).toBe('JASA001')
    })

    it('should filter by namaJasa (case insensitive)', () => {
      const result = filterServices(mockServices, { namaJasa: 'pengiriman' })
      expect(result).toHaveLength(2)
      expect(result.every(s => s.namaJasa.toLowerCase().includes('pengiriman'))).toBe(true)
    })

    it('should filter by servisCategory', () => {
      const result = filterServices(mockServices, { servisCategory: 'Logistik' })
      expect(result).toHaveLength(2)
    })

    it('should filter by namaVarian', () => {
      const result = filterServices(mockServices, { namaVarian: 'Same' })
      expect(result).toHaveLength(1)
      expect(result[0].namaVarian).toBe('Same Day')
    })
  })

  describe('multiple filters', () => {
    it('should apply all filters (AND logic)', () => {
      const result = filterServices(mockServices, {
        servisCategory: 'Logistik',
        namaVarian: 'Same Day',
      })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('should return empty when filters dont match', () => {
      const result = filterServices(mockServices, {
        servisCategory: 'Logistik',
        namaVarian: 'Premium',
      })
      expect(result).toHaveLength(0)
    })
  })

  describe('partial matching', () => {
    it('should support partial code matching', () => {
      const result = filterServices(mockServices, { kodeJasa: 'JASA' })
      expect(result).toHaveLength(3)
    })

    it('should support partial name matching', () => {
      const result = filterServices(mockServices, { namaJasa: 'Jasa' })
      expect(result).toHaveLength(3)
    })
  })

  describe('case insensitivity', () => {
    it('should filter case-insensitively', () => {
      const result1 = filterServices(mockServices, { namaJasa: 'pengiriman' })
      const result2 = filterServices(mockServices, { namaJasa: 'PENGIRIMAN' })
      const result3 = filterServices(mockServices, { namaJasa: 'Pengiriman' })

      expect(result1).toHaveLength(2)
      expect(result2).toHaveLength(2)
      expect(result3).toHaveLength(2)
    })
  })

  describe('empty search results', () => {
    it('should return empty array when no matches', () => {
      const result = filterServices(mockServices, { kodeJasa: 'NOMATCH' })
      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })

    it('should return empty for non-existent category', () => {
      const result = filterServices(mockServices, { servisCategory: 'NonExistent' })
      expect(result).toHaveLength(0)
    })
  })
})
