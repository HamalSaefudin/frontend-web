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
  type MasterKasResponse,
} from "../../../services/master-kas";
import { fetchBranches, type Branch } from "../../../services/master-cabang";
import { fetchDataAsync } from "@frontend/shared";
import { useErrorStore } from "@frontend/shared/store/useErrorStore.ts";

export type { MasterKas, MasterKasFilters, Branch };

// Query hooks
export const useQueryMasterKasList = (filters: MasterKasFilters = {}) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<MasterKasResponse>({
    queryKey: ["master-kas", filters],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: () => getMasterKasList(filters),
        setError,
        menuName: "master-kas-list",
      });
      return response?.data?.data ?? { data: [], total: 0, page: 1, limit: 10 };
    },
  });
};

export const useQueryMasterKasById = (id: string) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<MasterKas | undefined>({
    queryKey: ["master-kas", id],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: () => getMasterKasList({ page: 1, limit: 1 }),
        setError,
        menuName: "master-kas-detail",
      });
      const data = response?.data?.data?.data;
      return data?.find((k) => k.id === id);
    },
    enabled: !!id,
  });
};

export const useQueryCabang = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<Branch[]>({
    queryKey: ["cabang"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: fetchBranches,
        setError,
        menuName: "cabang",
      });
      return response?.data?.data ?? [];
    },
  });
};

// Mutation hooks
export const useMutationCreateMasterKas = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (kasData: Omit<MasterKas, "id" | "createdAt" | "updatedAt">) =>
      fetchDataAsync({
        asyncFn: () => createMasterKas(kasData),
        setError,
        menuName: "create-master-kas",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["master-kas"] });
    },
  });
};

export const useMutationUpdateMasterKas = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<MasterKas, "id" | "createdAt" | "updatedAt">>;
    }) =>
      fetchDataAsync({
        asyncFn: () => updateMasterKas(id, data),
        setError,
        menuName: "update-master-kas",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["master-kas"] });
    },
  });
};

export const useMutationDeleteMasterKas = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchDataAsync({
        asyncFn: () => deleteMasterKas(id),
        setError,
        menuName: "delete-master-kas",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["master-kas"] });
    },
  });
};

export const useMutationUpdateMasterKasStatus = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      fetchDataAsync({
        asyncFn: () => updateMasterKasStatus(id, status),
        setError,
        menuName: "update-master-kas-status",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["master-kas"] });
    },
  });
};

export const useMutationExportMasterKas = () => {
  const setError = useErrorStore((s) => s.setError);
  return useMutation({
    mutationFn: ({
      filters,
      format,
    }: {
      filters: MasterKasFilters;
      format: "pdf" | "excel";
    }) =>
      fetchDataAsync({
        asyncFn: () => exportMasterKas(filters, format),
        setError,
        menuName: "export-master-kas",
      }),
  });
};