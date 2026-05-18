import { describe, it, expect } from 'vitest'
import {
  fetchBranches,
  fetchServices,
  createService,
  updateService,
  deleteService,
} from '../../src/services/master-service'

describe('Master Service API', () => {
  describe('fetchBranches', () => {
    it('should return branches list', async () => {
      const result = await fetchBranches()
      expect(result).toBeTruthy()
      expect(result[0]).toHaveProperty('kodeCabang')
      expect(result[0]).toHaveProperty('namaCabang')
    })

    it('should return branches with correct structure', async () => {
      const result = await fetchBranches()
      result.forEach(branch => {
        expect(branch).toHaveProperty('id')
        expect(branch).toHaveProperty('kodeCabang')
        expect(branch).toHaveProperty('namaCabang')
        expect(typeof branch.id).toBe('string')
      })
    })
  })

  describe('fetchServices', () => {
    it('should return all services when branchId is not provided', async () => {
      const result = await fetchServices()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return services for specific branch', async () => {
      const result = await fetchServices('1')
      expect(result).toHaveLength(3) // Branch 1 has 3 services
      expect(result.every(s => s.branchId === '1')).toBe(true)
    })

    it('should return empty array for branch with no services', async () => {
      const result = await fetchServices('999')
      expect(result).toEqual([])
    })

    it('should filter services correctly by branchId', async () => {
      const branch1 = await fetchServices('1')
      const branch2 = await fetchServices('2')

      expect(branch1.length).toBeGreaterThan(0)
      expect(branch2.length).toBeGreaterThan(0)
      expect(branch1.some(s => s.branchId === '2')).toBe(false)
      expect(branch2.some(s => s.branchId === '1')).toBe(false)
    })

    it('should return services with all required fields', async () => {
      const result = await fetchServices('1')
      result.forEach(service => {
        expect(service).toHaveProperty('id')
        expect(service).toHaveProperty('kodeJasa')
        expect(service).toHaveProperty('namaJasa')
        expect(service).toHaveProperty('servisCategory')
        expect(service).toHaveProperty('kodeHarian')
        expect(service).toHaveProperty('namaVarian')
        expect(service).toHaveProperty('kodeVarian')
        expect(service).toHaveProperty('branchId')
      })
    })
  })

  describe('createService', () => {
    it('should create a new service', async () => {
      const newService = {
        kodeJasa: 'TEST001',
        namaJasa: 'Test Service',
        servisCategory: 'Testing',
        kodeHarian: 'TST001',
        namaVarian: 'Variant',
        kodeVarian: 'VAR001',
        branchId: '1',
      }

      const result = await createService(newService)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.kodeJasa).toBe('TEST001')
      expect(result.data?.namaJasa).toBe('Test Service')
    })

    it('should return success message', async () => {
      const newService = {
        kodeJasa: 'TEST001',
        namaJasa: 'Test Service',
        servisCategory: 'Testing',
        kodeHarian: 'TST001',
        namaVarian: 'Variant',
        kodeVarian: 'VAR001',
        branchId: '1',
      }

      const result = await createService(newService)
      expect(result.message).toContain('success')
    })
  })

  describe('updateService', () => {
    it('should update a service', async () => {
      const updateData = {
        kodeJasa: 'UPDATED',
        namaJasa: 'Updated Service',
        servisCategory: 'Updated',
        kodeHarian: 'UPD001',
        namaVarian: 'Updated Variant',
        kodeVarian: 'UPDVAR',
        branchId: '1',
      }

      const result = await updateService('1', updateData)

      expect(result.success).toBe(true)
      expect(result.data?.id).toBe('1')
      expect(result.data?.namaJasa).toBe('Updated Service')
    })

    it('should return updated service data', async () => {
      const updateData = {
        kodeJasa: 'NEW',
        namaJasa: 'New Name',
        servisCategory: 'NewCat',
        kodeHarian: 'NEW001',
        namaVarian: 'NewVar',
        kodeVarian: 'NEWVAR',
        branchId: '1',
      }

      const result = await updateService('1', updateData)
      expect(result.data).toMatchObject(updateData)
    })
  })

  describe('deleteService', () => {
    it('should delete a service', async () => {
      const result = await deleteService()
      expect(result.success).toBe(true)
      expect(result.message).toContain('deleted')
    })

    it('should return success message', async () => {
      const result = await deleteService()
      expect(result.message).toBeDefined()
      expect(result.message.length).toBeGreaterThan(0)
    })
  })
})
