import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMasterKasList,
  createMasterKas,
  updateMasterKas,
  deleteMasterKas,
  updateMasterKasStatus,
  exportMasterKas,
  type MasterKas,
  type MasterKasFilters,
} from "@/services/master-kas";
import { fetchBranches, type Branch } from "@/services/master-cabang";

export type { MasterKas, MasterKasFilters, Branch };

// Query hooks
export const useQueryMasterKasList = (filters: MasterKasFilters = {}) => {
  return useQuery({
    queryKey: ["master-kas", filters],
    queryFn: () => getMasterKasList(filters),
  });
};

export const useQueryMasterKasById = (id: string) => {
  return useQuery({
    queryKey: ["master-kas", id],
    queryFn: () => getMasterKasList({ page: 1, limit: 1 }),
    select: (response) => response.data.find((k) => k.id === id),
    enabled: !!id,
  });
};

export const useQueryCabang = () => {
  return useQuery({
    queryKey: ["cabang"],
    queryFn: () => fetchBranches(),
  });
};

// Mutation hooks
export const useMutationCreateMasterKas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MasterKas, "id" | "createdAt" | "updatedAt">) =>
      createMasterKas(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["master-kas"] });
    },
  });
};

export const useMutationUpdateMasterKas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<MasterKas, "id" | "createdAt" | "updatedAt">>;
    }) => updateMasterKas(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["master-kas"] });
    },
  });
};

export const useMutationDeleteMasterKas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMasterKas(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["master-kas"] });
    },
  });
};

export const useMutationUpdateMasterKasStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      updateMasterKasStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["master-kas"] });
    },
  });
};

export const useMutationExportMasterKas = () => {
  return useMutation({
    mutationFn: ({
      filters,
      format,
    }: {
      filters: MasterKasFilters;
      format: "pdf" | "excel";
    }) => exportMasterKas(filters, format),
  });
};