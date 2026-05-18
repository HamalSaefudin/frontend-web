import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FjbFilters, FjbDetail } from "@/services/fjb-types";
import {
  getFjbList,
  getFjbDetail,
  createFjb,
  updateFjb,
  deleteFjb,
  validateNomorMesin,
  getMasterCabang,
  getMasterTipeFjb,
  getMasterVarian,
  getMasterWarna,
  getMasterPekerjaan,
  getMasterAgama,
  getMasterJenisKelamin,
  getMasterJenisPit,
  getMasterMekanik,
  getMasterSa,
  getMasterJasa,
  getMasterPart,
} from "@/services/fjb";

export const useQueryFjbList = (filters: FjbFilters) =>
  useQuery({
    queryKey: ["fjb", "list", filters],
    queryFn: () => getFjbList(filters),
  });

export const useQueryFjbDetail = (id: string | undefined) =>
  useQuery({
    queryKey: ["fjb", "detail", id],
    queryFn: () => (id ? getFjbDetail(id) : Promise.resolve(null)),
    enabled: !!id,
  });

export const useMutationCreateFjb = () => {
  const qc = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: unknown) => createFjb(data as FjbDetail),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fjb"] });
    },
  });
};

export const useMutationUpdateFjb = () => {
  const qc = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateFjb(id, data as FjbDetail),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fjb"] });
    },
  });
};

export const useMutationDeleteFjb = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFjb(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fjb"] });
    },
  });
};

export const useMutationValidateNomorMesin = () =>
  useMutation({
    mutationFn: (nomorMesin: string) => validateNomorMesin(nomorMesin),
  });

// Master data queries
export const useQueryMasterCabang = () =>
  useQuery({
    queryKey: ["master", "cabang"],
    queryFn: getMasterCabang,
  });

export const useQueryMasterTipeFjb = () =>
  useQuery({
    queryKey: ["master", "tipeFjb"],
    queryFn: getMasterTipeFjb,
  });

export const useQueryMasterVarian = () =>
  useQuery({
    queryKey: ["master", "varian"],
    queryFn: getMasterVarian,
  });

export const useQueryMasterWarna = () =>
  useQuery({
    queryKey: ["master", "warna"],
    queryFn: getMasterWarna,
  });

export const useQueryMasterPekerjaan = () =>
  useQuery({
    queryKey: ["master", "pekerjaan"],
    queryFn: getMasterPekerjaan,
  });

export const useQueryMasterAgama = () =>
  useQuery({
    queryKey: ["master", "agama"],
    queryFn: getMasterAgama,
  });

export const useQueryMasterJenisKelamin = () =>
  useQuery({
    queryKey: ["master", "jenisKelamin"],
    queryFn: getMasterJenisKelamin,
  });

export const useQueryMasterJenisPit = () =>
  useQuery({
    queryKey: ["master", "jenisPit"],
    queryFn: getMasterJenisPit,
  });

export const useQueryMasterMekanik = () =>
  useQuery({
    queryKey: ["master", "mekanik"],
    queryFn: getMasterMekanik,
  });

export const useQueryMasterSa = () =>
  useQuery({
    queryKey: ["master", "sa"],
    queryFn: getMasterSa,
  });

export const useQueryMasterJasa = () =>
  useQuery({
    queryKey: ["master", "jasa"],
    queryFn: getMasterJasa,
  });

export const useQueryMasterPart = () =>
  useQuery({
    queryKey: ["master", "part"],
    queryFn: getMasterPart,
  });