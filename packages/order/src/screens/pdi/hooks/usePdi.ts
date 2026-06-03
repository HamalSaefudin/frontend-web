import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  PdiFilters,
  PdiData,
  PdiUnit,
  PdiPhysicalChecklistItem,
  PdiKsuItem,
  PdiHadiahItem,
  PdiBarangLainItem,
  PdiPartItem,
  PdiPhoto,
} from "@frontend/shared";
import type { Branch } from "../../../services/master-lookups";
import {
  fetchPdiUnits,
  fetchPdiData,
  savePdiChecklist,
  savePdiKsu,
  savePdiHadiah,
  savePdiBarangLain,
  savePdiPart,
  uploadPdiPhoto,
  deletePdiPhoto,
  processPdi,
  rejectPdi,
} from "../../../services/pdi";
import { fetchBranches } from "../../../services/master-lookups";

export type { PdiData, PdiFilters };
export type { Branch };

// Query hooks
export const useQueryCabang = () => {
  return useQuery<Branch[]>({
    queryKey: ["cabang"],
    queryFn: async () => {
      const response = await fetchBranches();
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryPdiUnits = (
  page: number = 1,
  pageSize: number = 10,
  filters?: PdiFilters
) => {
  return useQuery<{ data: PdiUnit[]; total: number }>({
    queryKey: ["pdi-units", page, pageSize, filters],
    queryFn: async () => {
      const response = await fetchPdiUnits(page, pageSize, filters);
      return response?.data?.data ?? { data: [], total: 0 };
    },
  });
};

export const useQueryPdiData = (unitId: string) => {
  return useQuery<PdiData | null>({
    queryKey: ["pdi-data", unitId],
    queryFn: async () => {
      if (!unitId) return null;
      const response = await fetchPdiData(unitId);
      return response?.data?.data ?? null;
    },
    enabled: !!unitId,
  });
};

// Mutation hooks
export const useMutationSaveChecklist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      unitId,
      checklist,
    }: {
      unitId: string;
      checklist: PdiPhysicalChecklistItem[];
    }) => savePdiChecklist(unitId, checklist),
    onSuccess: (_, { unitId }) => {
      qc.invalidateQueries({ queryKey: ["pdi-data", unitId] });
    },
  });
};

export const useMutationSaveKsu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ unitId, ksu }: { unitId: string; ksu: PdiKsuItem[] }) =>
      savePdiKsu(unitId, ksu),
    onSuccess: (_, { unitId }) => {
      qc.invalidateQueries({ queryKey: ["pdi-data", unitId] });
    },
  });
};

export const useMutationSaveHadiah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      unitId,
      hadiah,
    }: {
      unitId: string;
      hadiah: PdiHadiahItem[];
    }) => savePdiHadiah(unitId, hadiah),
    onSuccess: (_, { unitId }) => {
      qc.invalidateQueries({ queryKey: ["pdi-data", unitId] });
    },
  });
};

export const useMutationSaveBarangLain = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      unitId,
      barangLain,
    }: {
      unitId: string;
      barangLain: PdiBarangLainItem[];
    }) => savePdiBarangLain(unitId, barangLain),
    onSuccess: (_, { unitId }) => {
      qc.invalidateQueries({ queryKey: ["pdi-data", unitId] });
    },
  });
};

export const useMutationSavePart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ unitId, parts }: { unitId: string; parts: PdiPartItem[] }) =>
      savePdiPart(unitId, parts),
    onSuccess: (_, { unitId }) => {
      qc.invalidateQueries({ queryKey: ["pdi-data", unitId] });
    },
  });
};

export const useMutationUploadPhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      unitId,
      photo,
    }: {
      unitId: string;
      photo: { file: File; kategori: PdiPhoto["kategori"] };
    }) => uploadPdiPhoto(unitId, photo),
    onSuccess: (_, { unitId }) => {
      qc.invalidateQueries({ queryKey: ["pdi-data", unitId] });
    },
  });
};

export const useMutationDeletePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ unitId, photoId }: { unitId: string; photoId: string }) =>
      deletePdiPhoto(unitId, photoId),
    onSuccess: (_, { unitId }) => {
      qc.invalidateQueries({ queryKey: ["pdi-data", unitId] });
    },
  });
};

export const useMutationProcessPdi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (unitId: string) => processPdi(unitId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pdi-units"] });
    },
  });
};

export const useMutationRejectPdi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (unitId: string) => rejectPdi(unitId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pdi-units"] });
    },
  });
};