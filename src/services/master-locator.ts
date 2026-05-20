// Master Lokasi Warehouse API functions
// TODO: Replace with actual API endpoints

export interface LokasiWarehouse {
  id: string;
  kodeLokasi: string;
  kodeCabang: string;
  namaLokasi: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface LokasiFilterParams {
  kodeLokasi?: string;
  kodeCabang?: string;
  namaLokasi?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

interface MutationResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  errors: Array<{ field: string; message: string }>;
}

const DUMMY_LOKASI: LokasiWarehouse[] = [
  { id: '1', kodeLokasi: 'WH-JKT-01', kodeCabang: 'JKT01', namaLokasi: 'Warehouse Jakarta Utama', status: 'ACTIVE' },
  { id: '2', kodeLokasi: 'WH-JKT-02', kodeCabang: 'JKT01', namaLokasi: 'Warehouse Jakarta Timur', status: 'ACTIVE' },
  { id: '3', kodeLokasi: 'WH-SBY-01', kodeCabang: 'SBY01', namaLokasi: 'Warehouse Surabaya Barat', status: 'ACTIVE' },
  { id: '4', kodeLokasi: 'WH-BDG-01', kodeCabang: 'BDG01', namaLokasi: 'Warehouse Bandung Utara', status: 'INACTIVE' },
  { id: '5', kodeLokasi: 'WH-MDN-01', kodeCabang: 'MDN01', namaLokasi: 'Warehouse Medan Sentral', status: 'ACTIVE' },
];

// List Lokasi Warehouse
export const getLokasiList = async (params?: LokasiFilterParams): Promise<MutationResponse<{ items: LokasiWarehouse[]; total: number }>> => {
  // TODO: Replace with actual API call to GET /api/v1/master-locator
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...DUMMY_LOKASI];
      
      // Apply filters with wildcard support
      if (params?.kodeLokasi) {
        const search = params.kodeLokasi.replace(/%/g, '');
        filtered = filtered.filter(l => l.kodeLokasi.toLowerCase().includes(search.toLowerCase()));
      }
      if (params?.kodeCabang) {
        const search = params.kodeCabang.replace(/%/g, '');
        filtered = filtered.filter(l => l.kodeCabang.toLowerCase().includes(search.toLowerCase()));
      }
      if (params?.namaLokasi) {
        const search = params.namaLokasi.replace(/%/g, '');
        filtered = filtered.filter(l => l.namaLokasi.toLowerCase().includes(search.toLowerCase()));
      }
      if (params?.keyword) {
        const search = params.keyword.replace(/%/g, '');
        filtered = filtered.filter(l => 
          l.kodeLokasi.toLowerCase().includes(search.toLowerCase()) ||
          l.namaLokasi.toLowerCase().includes(search.toLowerCase())
        );
      }

      resolve({
        success: true,
        code: 'LOKASI_LIST_SUCCESS',
        message: 'Success',
        data: { items: filtered, total: filtered.length },
        errors: [],
      });
    }, 300);
  });
};

// Get Lokasi Detail
export const getLokasiDetail = async (id: string): Promise<MutationResponse<LokasiWarehouse>> => {
  // TODO: Replace with actual API call to GET /api/v1/master-locator/{id}
  return new Promise((resolve) => {
    setTimeout(() => {
      const lokasi = DUMMY_LOKASI.find(l => l.id === id);
      if (lokasi) {
        resolve({
          success: true,
          code: 'LOKASI_DETAIL_SUCCESS',
          message: 'Success',
          data: lokasi,
          errors: [],
        });
      } else {
        resolve({
          success: false,
          code: 'LOKASI_NOT_FOUND',
          message: 'Lokasi warehouse not found',
          data: undefined,
          errors: [{ field: 'id', message: 'Lokasi warehouse not found' }],
        });
      }
    }, 300);
  });
};

// Create Lokasi Warehouse
export const createLokasi = async (data: Omit<LokasiWarehouse, 'id'>): Promise<MutationResponse<{ id: string }>> => {
  // TODO: Replace with actual API call to POST /api/v1/master-locator
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check for duplicate kodeLokasi
      const exists = DUMMY_LOKASI.some(l => l.kodeLokasi === data.kodeLokasi);
      if (exists) {
        resolve({
          success: false,
          code: 'LOKASI_CODE_EXISTS',
          message: 'Kode lokasi sudah terdaftar',
          data: undefined,
          errors: [{ field: 'kodeLokasi', message: 'Kode lokasi sudah digunakan' }],
        });
        return;
      }

      const newId = (Date.now()).toString();
      resolve({
        success: true,
        code: 'LOKASI_CREATED',
        message: 'Lokasi warehouse created successfully',
        data: { id: newId },
        errors: [],
      });
    }, 500);
  });
};

// Update Lokasi Warehouse
export const updateLokasi = async (id: string, data: Omit<LokasiWarehouse, 'id'>): Promise<MutationResponse<{ lokasiId: string }>> => {
  // TODO: Replace with actual API call to PUT /api/v1/master-locator/{id}
  return new Promise((resolve) => {
    setTimeout(() => {
      const exists = DUMMY_LOKASI.find(l => l.id === id);
      if (!exists) {
        resolve({
          success: false,
          code: 'LOKASI_NOT_FOUND',
          message: 'Lokasi warehouse not found',
          data: undefined,
          errors: [{ field: 'id', message: 'Lokasi warehouse not found' }],
        });
        return;
      }

      // Check for duplicate kodeLokasi (excluding current id)
      const duplicate = DUMMY_LOKASI.some(l => l.kodeLokasi === data.kodeLokasi && l.id !== id);
      if (duplicate) {
        resolve({
          success: false,
          code: 'LOKASI_CODE_EXISTS',
          message: 'Kode lokasi sudah terdaftar',
          data: undefined,
          errors: [{ field: 'kodeLokasi', message: 'Kode lokasi sudah digunakan' }],
        });
        return;
      }

      resolve({
        success: true,
        code: 'LOKASI_UPDATED',
        message: 'Lokasi warehouse updated successfully',
        data: { lokasiId: id },
        errors: [],
      });
    }, 500);
  });
};

// Delete Lokasi Warehouse
export const deleteLokasi = async (id: string): Promise<MutationResponse<{ lokasiId: string }>> => {
  // TODO: Replace with actual API call to DELETE /api/v1/master-locator/{id}
  return new Promise((resolve) => {
    setTimeout(() => {
      const exists = DUMMY_LOKASI.find(l => l.id === id);
      if (!exists) {
        resolve({
          success: false,
          code: 'LOKASI_NOT_FOUND',
          message: 'Lokasi warehouse not found',
          data: undefined,
          errors: [{ field: 'id', message: 'Lokasi warehouse not found' }],
        });
        return;
      }

      resolve({
        success: true,
        code: 'LOKASI_DELETED',
        message: 'Lokasi warehouse deleted successfully',
        data: { lokasiId: id },
        errors: [],
      });
    }, 500);
  });
};

// Update Lokasi Status
export const updateLokasiStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<MutationResponse<{ lokasiId: string; status: string }>> => {
  // TODO: Replace with actual API call to PATCH /api/v1/master-locator/{id}/status
  return new Promise((resolve) => {
    setTimeout(() => {
      const lokasi = DUMMY_LOKASI.find(l => l.id === id);
      if (!lokasi) {
        resolve({
          success: false,
          code: 'LOKASI_NOT_FOUND',
          message: 'Lokasi warehouse not found',
          data: undefined,
          errors: [{ field: 'id', message: 'Lokasi warehouse not found' }],
        });
        return;
      }

      if (status !== 'ACTIVE' && status !== 'INACTIVE') {
        resolve({
          success: false,
          code: 'INVALID_STATUS',
          message: 'Status harus ACTIVE atau INACTIVE',
          data: undefined,
          errors: [{ field: 'status', message: 'Status tidak valid' }],
        });
        return;
      }

      if (lokasi.status === status) {
        resolve({
          success: false,
          code: 'STATUS_ALREADY_SET',
          message: 'Status sudah sama dengan yang diminta',
          data: undefined,
          errors: [{ field: 'status', message: 'Status sudah sama' }],
        });
        return;
      }

      resolve({
        success: true,
        code: 'LOKASI_STATUS_UPDATED',
        message: 'Lokasi warehouse status updated successfully',
        data: { lokasiId: id, status },
        errors: [],
      });
    }, 500);
  });
};