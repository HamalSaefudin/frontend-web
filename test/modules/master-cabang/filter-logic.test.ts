import { describe, it, expect } from 'vitest'
import { filterBranches } from '../../../src/modules/master-cabang/utils/filterBranches'
import type { Branch } from '../../../src/services/master-cabang'

const mockBranches: Branch[] = [
  { id: '1', kodeCabang: 'CB001', namaCabang: 'Cabang Jakarta', namaLead: 'Budi Santoso' },
  { id: '2', kodeCabang: 'CB002', namaCabang: 'Cabang Surabaya', namaLead: 'Siti Nurhaliza' },
  { id: '3', kodeCabang: 'CB003', namaCabang: 'Cabang Bandung', namaLead: 'Ahmad Wijaya' },
  { id: '4', kodeCabang: 'CB004', namaCabang: 'Cabang Medan', namaLead: 'Rini Handayani' },
  { id: '5', kodeCabang: 'CB005', namaCabang: 'Cabang Yogyakarta', namaLead: 'Dwi Prasetyo' },
]

describe('Branch Filter Logic', () => {
  describe('empty filters', () => {
    it('should return all branches when no filters applied', () => {
      const result = filterBranches(mockBranches, {})
      expect(result).toHaveLength(5)
    })

    it('should return all branches with undefined criteria', () => {
      const result = filterBranches(mockBranches, {
        kodeCabang: undefined,
        namaCabang: undefined,
        namaLead: undefined,
      })
      expect(result).toHaveLength(5)
    })
  })

  describe('single filter', () => {
    it('should filter by kodeCabang', () => {
      const result = filterBranches(mockBranches, { kodeCabang: 'CB001' })
      expect(result).toHaveLength(1)
      expect(result[0].kodeCabang).toBe('CB001')
    })

    it('should filter by namaCabang (case insensitive)', () => {
      const result = filterBranches(mockBranches, { namaCabang: 'jakarta' })
      expect(result).toHaveLength(1)
      expect(result[0].namaCabang).toContain('Jakarta')
    })

    it('should filter by namaLead (case insensitive)', () => {
      const result = filterBranches(mockBranches, { namaLead: 'budi' })
      expect(result).toHaveLength(1)
      expect(result[0].namaLead).toBe('Budi Santoso')
    })
  })

  describe('multiple filters', () => {
    it('should apply all filters (AND logic)', () => {
      const result = filterBranches(mockBranches, {
        namaCabang: 'Cabang',
        namaLead: 'Budi',
      })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('should return empty when filters dont match', () => {
      const result = filterBranches(mockBranches, {
        kodeCabang: 'CB001',
        namaCabang: 'Surabaya',
      })
      expect(result).toHaveLength(0)
    })

    it('should apply all three filters', () => {
      const result = filterBranches(mockBranches, {
        kodeCabang: 'CB002',
        namaCabang: 'Surabaya',
        namaLead: 'Siti',
      })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })
  })

  describe('partial matching', () => {
    it('should support partial code matching', () => {
      const result = filterBranches(mockBranches, { kodeCabang: 'CB00' })
      expect(result).toHaveLength(5)
    })

    it('should support partial name matching', () => {
      const result = filterBranches(mockBranches, { namaCabang: 'Cabang' })
      expect(result).toHaveLength(5)
    })

    it('should support partial lead name matching', () => {
      const result = filterBranches(mockBranches, { namaLead: 'Bud' })
      expect(result).toHaveLength(1)
      expect(result[0].namaLead).toBe('Budi Santoso')
    })
  })

  describe('case insensitivity', () => {
    it('should filter kodeCabang case-insensitively', () => {
      const result1 = filterBranches(mockBranches, { kodeCabang: 'cb001' })
      const result2 = filterBranches(mockBranches, { kodeCabang: 'CB001' })
      const result3 = filterBranches(mockBranches, { kodeCabang: 'Cb001' })

      expect(result1).toHaveLength(1)
      expect(result2).toHaveLength(1)
      expect(result3).toHaveLength(1)
    })

    it('should filter namaCabang case-insensitively', () => {
      const result1 = filterBranches(mockBranches, { namaCabang: 'jakarta' })
      const result2 = filterBranches(mockBranches, { namaCabang: 'JAKARTA' })
      const result3 = filterBranches(mockBranches, { namaCabang: 'Jakarta' })

      expect(result1).toHaveLength(1)
      expect(result2).toHaveLength(1)
      expect(result3).toHaveLength(1)
    })

    it('should filter namaLead case-insensitively', () => {
      const result1 = filterBranches(mockBranches, { namaLead: 'ahmad' })
      const result2 = filterBranches(mockBranches, { namaLead: 'AHMAD' })
      const result3 = filterBranches(mockBranches, { namaLead: 'Ahmad' })

      expect(result1).toHaveLength(1)
      expect(result2).toHaveLength(1)
      expect(result3).toHaveLength(1)
    })
  })

  describe('empty search results', () => {
    it('should return empty array when no matches', () => {
      const result = filterBranches(mockBranches, { kodeCabang: 'NOMATCH' })
      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })

    it('should return empty for non-existent branch', () => {
      const result = filterBranches(mockBranches, { namaCabang: 'NonExistent' })
      expect(result).toHaveLength(0)
    })

    it('should return empty for non-existent lead', () => {
      const result = filterBranches(mockBranches, { namaLead: 'NonExistent' })
      expect(result).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('should handle special characters in search', () => {
      const result = filterBranches(mockBranches, { namaCabang: 'Cabang.*' })
      expect(result).toHaveLength(0)
    })

    it('should handle empty string filters', () => {
      const result = filterBranches(mockBranches, { kodeCabang: '' })
      expect(result).toHaveLength(5)
    })

    it('should handle whitespace-only filters', () => {
      const result = filterBranches(mockBranches, { kodeCabang: '   ' })
      expect(result).toHaveLength(0)
    })
  })
})
