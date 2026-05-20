// Master Kas API functions
// TODO: Replace with actual API endpoints

import type { MasterKas, MasterKasFilters, MasterKasResponse } from "@/types";

export type { MasterKas, MasterKasFilters, MasterKasResponse };

interface MutationResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
  };
}

const DUMMY_KAS: MasterKas[] = [
  { id: "1", kodeKas: "KS001", namaCabang: "Cabang Jakarta", namaKas: "Kas Jakarta Pusat", status: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "2", kodeKas: "KS002", namaCabang: "Cabang Surabaya", namaKas: "Kas Surabaya Timur", status: true, createdAt: "2024-01-02T00:00:00Z", updatedAt: "2024-01-02T00:00:00Z" },
  { id: "3", kodeKas: "KS003", namaCabang: "Cabang Bandung", namaKas: "Kas Bandung Utara", status: false, createdAt: "2024-01-03T00:00:00Z", updatedAt: "2024-01-03T00:00:00Z" },
  { id: "4", kodeKas: "KS004", namaCabang: "Cabang Medan", namaKas: "Kas Medan", status: true, createdAt: "2024-01-04T00:00:00Z", updatedAt: "2024-01-04T00:00:00Z" },
  { id: "5", kodeKas: "KS005", namaCabang: "Cabang Yogyakarta", namaKas: "Kas Yogyakarta", status: true, createdAt: "2024-01-05T00:00:00Z", updatedAt: "2024-01-05T00:00:00Z" },
];

// Get list of master kas with pagination, search, and filter
export const getMasterKasList = async (filters: MasterKasFilters = {}): Promise<MasterKasResponse> => {
  // TODO: Replace with actual API call to GET /api/master-kas
  const { page = 1, limit = 10, namaKas, kodeKas, cabangId, status } = filters;

  return new Promise((resolve) => {
    setTimeout(() => {
      // Use dummy data for mock - create a copy
      const dataList = [...DUMMY_KAS];
      let filtered = [...dataList];

      // Apply search
      if (namaKas) {
        filtered = filtered.filter((k) =>
          k.namaKas.toLowerCase().includes(namaKas.toLowerCase()),
        );
      }

      // Apply filters
      if (kodeKas) {
        filtered = filtered.filter((k) =>
          k.kodeKas.toLowerCase().includes(kodeKas.toLowerCase()),
        );
      }
      if (cabangId) {
        filtered = filtered.filter((k) => k.namaCabang === cabangId);
      }
      if (status !== undefined) {
        filtered = filtered.filter((k) => k.status === status);
      }

      const total = filtered.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = filtered.slice(start, end);

      resolve({
        data,
        total,
        page,
        limit,
      });
    }, 300);
  });
};

// Create new master kas
export const createMasterKas = async (
  kasData: Omit<MasterKas, "id" | "createdAt" | "updatedAt">,
): Promise<MutationResponse<MasterKas>> => {
  // TODO: Replace with actual API call to POST /api/master-kas

  // Check for duplicate kodeKas (using dummy data for mock)
  const exists = DUMMY_KAS.some((k) => k.kodeKas === kasData.kodeKas);
  if (exists) {
    return {
      success: false,
      message: "Kode Kas already exists",
      error: { code: "DUPLICATE_KODE_KAS" },
    };
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const newKas: MasterKas = {
        id: Date.now().toString(),
        ...kasData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resolve({
        success: true,
        message: "Master Kas created successfully",
        data: newKas,
      });
    }, 500);
  });
};

// Update existing master kas
export const updateMasterKas = async (
  id: string,
  kasData: Partial<Omit<MasterKas, "id" | "createdAt" | "updatedAt">>,
): Promise<MutationResponse<MasterKas>> => {
  // TODO: Replace with actual API call to PUT /api/master-kas/:id
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = DUMMY_KAS.find((k) => k.id === id);
      if (!existing) {
        resolve({
          success: false,
          message: "Master Kas not found",
          error: { code: "NOT_FOUND" },
        });
        return;
      }

      const updated: MasterKas = {
        ...existing,
        ...kasData,
        updatedAt: new Date().toISOString(),
      };
      resolve({
        success: true,
        message: "Master Kas updated successfully",
        data: updated,
      });
    }, 500);
  });
};

// Delete master kas
export const deleteMasterKas = async (id: string): Promise<MutationResponse> => {
  // TODO: Replace with actual API call to DELETE /api/master-kas/:id

  // Check if kas is used in transactions
  // TODO: Implement actual transaction check
  const isUsed = false;
  if (isUsed) {
    return {
      success: false,
      message: "Master Kas is used in transactions and cannot be deleted",
      error: { code: "IN_USE" },
    };
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = DUMMY_KAS.find((k) => k.id === id);
      if (!existing) {
        resolve({
          success: false,
          message: "Master Kas not found",
          error: { code: "NOT_FOUND" },
        });
        return;
      }

      resolve({
        success: true,
        message: "Master Kas deleted successfully",
      });
    }, 500);
  });
};

// Update master kas status (active/inactive)
export const updateMasterKasStatus = async (
  id: string,
  status: boolean,
): Promise<MutationResponse<MasterKas>> => {
  // TODO: Replace with actual API call to PATCH /api/master-kas/:id/status
  return updateMasterKas(id, { status });
};

// Export master kas data
export const exportMasterKas = async (
  filters: MasterKasFilters = {},
  format: "pdf" | "excel" = "excel",
): Promise<Blob> => {
  // TODO: Replace with actual API call to GET /api/master-kas/export
  const data = await getMasterKasList({ ...filters, page: 1, limit: 1000 });

  // TODO: Implement actual export logic
  console.log("Exporting data:", { filters, format, data: data.data });

  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a simple CSV-like blob for demo
      const csvContent =
        "Kode Kas,Nama Cabrera,Nama Kas,Status\n" +
        data.data
          .map(
            (k) =>
              `${k.kodeKas},${k.namaCabang},${k.namaKas},${k.status ? "Aktif" : "Nonaktif"}`,
          )
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      resolve(blob);
    }, 500);
  });
};