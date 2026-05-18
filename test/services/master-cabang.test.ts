import { describe, it, expect } from 'vitest'
import {
  fetchBranches,
  fetchBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  type Branch,
} from '../../src/services/master-cabang'

describe('Master Cabang API', () => {
  describe('fetchBranches', () => {
    it('should return branches list', async () => {
      const result = await fetchBranches()
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return branches with correct structure', async () => {
      const result = await fetchBranches()
      result.forEach((branch) => {
        expect(branch).toHaveProperty('id')
        expect(branch).toHaveProperty('kodeCabang')
        expect(branch).toHaveProperty('namaCabang')
        expect(branch).toHaveProperty('namaLead')
        expect(typeof branch.id).toBe('string')
        expect(typeof branch.kodeCabang).toBe('string')
        expect(typeof branch.namaCabang).toBe('string')
        expect(typeof branch.namaLead).toBe('string')
      })
    })

    it('should return at least 5 dummy branches', async () => {
      const result = await fetchBranches()
      expect(result.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('fetchBranchById', () => {
    it('should return branch for valid id', async () => {
      const result = await fetchBranchById('1')
      expect(result).toBeTruthy()
      expect(result?.id).toBe('1')
    })

    it('should return null for non-existent id', async () => {
      const result = await fetchBranchById('999')
      expect(result).toBeNull()
    })

    it('should return branch with correct structure', async () => {
      const result = await fetchBranchById('1')
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('kodeCabang')
      expect(result).toHaveProperty('namaCabang')
      expect(result).toHaveProperty('namaLead')
    })
  })

  describe('createBranch', () => {
    it('should create branch successfully', async () => {
      const branchData: Omit<Branch, 'id'> = {
        kodeCabang: 'CB999',
        namaCabang: 'Test Branch',
        namaLead: 'Test Lead',
      }
      const result = await createBranch(branchData)
      expect(result.success).toBe(true)
      expect(result.data).toBeTruthy()
      expect(result.data?.kodeCabang).toBe('CB999')
      expect(result.data?.namaCabang).toBe('Test Branch')
    })

    it('should generate unique id for created branch', async () => {
      const branchData: Omit<Branch, 'id'> = {
        kodeCabang: 'CB001',
        namaCabang: 'Branch 1',
        namaLead: 'Lead 1',
      }
      const result1 = await createBranch(branchData)
      const result2 = await createBranch(branchData)
      expect(result1.data?.id).not.toBe(result2.data?.id)
    })

    it('should return success message', async () => {
      const branchData: Omit<Branch, 'id'> = {
        kodeCabang: 'CB002',
        namaCabang: 'Branch 2',
        namaLead: 'Lead 2',
      }
      const result = await createBranch(branchData)
      expect(result.message).toBeTruthy()
      expect(result.message.includes('created')).toBe(true)
    })
  })

  describe('updateBranch', () => {
    it('should update branch successfully', async () => {
      const updateData: Omit<Branch, 'id'> = {
        kodeCabang: 'CB-UPDATED',
        namaCabang: 'Updated Branch',
        namaLead: 'Updated Lead',
      }
      const result = await updateBranch('1', updateData)
      expect(result.success).toBe(true)
      expect(result.data?.id).toBe('1')
      expect(result.data?.kodeCabang).toBe('CB-UPDATED')
    })

    it('should preserve id on update', async () => {
      const updateData: Omit<Branch, 'id'> = {
        kodeCabang: 'CB-TEST',
        namaCabang: 'Test',
        namaLead: 'Lead',
      }
      const result = await updateBranch('5', updateData)
      expect(result.data?.id).toBe('5')
    })

    it('should return success message', async () => {
      const updateData: Omit<Branch, 'id'> = {
        kodeCabang: 'CB-UPD',
        namaCabang: 'Updated',
        namaLead: 'New Lead',
      }
      const result = await updateBranch('1', updateData)
      expect(result.message).toBeTruthy()
      expect(result.message.includes('updated')).toBe(true)
    })
  })

  describe('deleteBranch', () => {
    it('should delete branch successfully', async () => {
      const result = await deleteBranch('1')
      expect(result.success).toBe(true)
    })

    it('should return success message', async () => {
      const result = await deleteBranch('1')
      expect(result.message).toBeTruthy()
      expect(result.message.includes('deleted')).toBe(true)
    })

    it('should work with any id', async () => {
      const result = await deleteBranch('999')
      expect(result.success).toBe(true)
    })
  })
})
