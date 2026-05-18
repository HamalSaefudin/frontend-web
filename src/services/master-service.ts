// Master Service API functions
// TODO: Replace with actual API endpoints

export interface Branch {
  id: string;
  kodeCabang: string;
  namaCabang: string;
}

export interface Service {
  id: string;
  kodeJasa: string;
  namaJasa: string;
  servisCategory: string;
  kodeHarian: string;
  namaVarian: string;
  kodeVarian: string;
  branchId: string;
}

interface MutationResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
  };
}

const DUMMY_BRANCHES: Branch[] = [
  { id: '1', kodeCabang: 'CB001', namaCabang: 'Cabang Jakarta' },
  { id: '2', kodeCabang: 'CB002', namaCabang: 'Cabang Surabaya' },
  { id: '3', kodeCabang: 'CB003', namaCabang: 'Cabang Bandung' },
  { id: '4', kodeCabang: 'CB004', namaCabang: 'Cabang Medan' },
];

const DUMMY_SERVICES: Service[] = [
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
  {
    id: '4',
    kodeJasa: 'JASA004',
    namaJasa: 'Jasa Perawatan',
    servisCategory: 'Perawatan',
    kodeHarian: 'HD004',
    namaVarian: 'Premium',
    kodeVarian: 'VAR004',
    branchId: '1',
  },
];

// Branch API calls
export const fetchBranches = async (): Promise<Branch[]> => {
  // TODO: Replace with actual API call to GET /api/branches
  // return new Promise((resolve) => {
  //   setTimeout(() => resolve(DUMMY_BRANCHES), 300);
  // });
  return DUMMY_BRANCHES
};

// Service API calls
export const fetchServices = async (branchId?: string): Promise<Service[]> => {
  // TODO: Replace with actual API call to GET /api/services?branchId=X
  return new Promise((resolve) => {
    setTimeout(() => {
      if (branchId) {
        resolve(DUMMY_SERVICES.filter(s => s.branchId === branchId));
      } else {
        resolve(DUMMY_SERVICES);
      }
    }, 300);
  });
};

export const createService = async (serviceData: Omit<Service, 'id'>): Promise<MutationResponse<Service>> => {
  // TODO: Replace with actual API call to POST /api/services
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Service created successfully',
        data: { id: Date.now().toString(), ...serviceData },
      });
    }, 500);
  });
};

export const updateService = async (id: string, serviceData: Omit<Service, 'id'>): Promise<MutationResponse<Service>> => {
  // TODO: Replace with actual API call to PUT /api/services/:id
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Service updated successfully',
        data: { id, ...serviceData },
      });
    }, 500);
  });
};

export const deleteService = async (): Promise<MutationResponse> => {
  // TODO: Replace with actual API call to DELETE /api/services/:_id
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Service deleted successfully',
      });
    }, 500);
  });
};
