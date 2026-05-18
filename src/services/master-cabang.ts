// Master Cabang (Branch Management) API functions
// TODO: Replace with actual API endpoints

export interface Branch {
  id: string;
  kodeCabang: string;
  namaCabang: string;
  namaLead: string;
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
  { id: '1', kodeCabang: 'CB001', namaCabang: 'Cabang Jakarta', namaLead: 'Budi Santoso' },
  { id: '2', kodeCabang: 'CB002', namaCabang: 'Cabang Surabaya', namaLead: 'Siti Nurhaliza' },
  { id: '3', kodeCabang: 'CB003', namaCabang: 'Cabang Bandung', namaLead: 'Ahmad Wijaya' },
  { id: '4', kodeCabang: 'CB004', namaCabang: 'Cabang Medan', namaLead: 'Rini Handayani' },
  { id: '5', kodeCabang: 'CB005', namaCabang: 'Cabang Yogyakarta', namaLead: 'Dwi Prasetyo' },
];

// Branch API calls
export const fetchBranches = async (): Promise<Branch[]> => {
  // TODO: Replace with actual API call to GET /api/cabang
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_BRANCHES), 300);
  });
};

export const fetchBranchById = async (id: string): Promise<Branch | null> => {
  // TODO: Replace with actual API call to GET /api/cabang/:id
  return new Promise((resolve) => {
    setTimeout(() => {
      const branch = DUMMY_BRANCHES.find(b => b.id === id);
      resolve(branch || null);
    }, 300);
  });
};

export const createBranch = async (branchData: Omit<Branch, 'id'>): Promise<MutationResponse<Branch>> => {
  // TODO: Replace with actual API call to POST /api/cabang
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Branch created successfully',
        data: { id: Date.now().toString(), ...branchData },
      });
    }, 500);
  });
};

export const updateBranch = async (id: string, branchData: Omit<Branch, 'id'>): Promise<MutationResponse<Branch>> => {
  // TODO: Replace with actual API call to PUT /api/cabang/:id
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Branch updated successfully',
        data: { id, ...branchData },
      });
    }, 500);
  });
};

export const deleteBranch = async (_id: string): Promise<MutationResponse> => {
  // TODO: Replace with actual API call to DELETE /api/cabang/:id
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Branch deleted successfully ${_id}`,
      });
    }, 500);
  });
};

export const importBranches = async (_file: File): Promise<MutationResponse<{ importedCount: number; failedCount: number; errors: Array<{ row: number; message: string }> }>> => {
  // TODO: Replace with actual API call to POST /api/cabang/import
  console.log(_file)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Branches imported successfully',
        data: { importedCount: 5, failedCount: 0, errors: [] },
      });
    }, 1000);
  });
};
