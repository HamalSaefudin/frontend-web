import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FjbFilters, FjbDetail, FjbListItem } from "@frontend/shared";
import type { SelectOption } from "@frontend/shared";
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
} from "../../../services/fjb";
import { fetchDataAsync } from "@frontend/shared";
import { useErrorStore } from "@frontend/shared/store/useErrorStore.ts";

export const useQueryFjbList = (filters: FjbFilters) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<FjbListItem[]>({
    queryKey: ["fjb", "list", filters],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: () => getFjbList(filters),
        setError,
        menuName: "fjb-list",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryFjbDetail = (id: string | undefined) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ["fjb", "detail", id],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => (id ? getFjbDetail(id) : Promise.resolve(null)),
        setError,
        menuName: "fjb-detail",
      }),
    enabled: !!id,
  });
};

export const useMutationCreateFjb = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      fetchDataAsync({
        asyncFn: () => createFjb(data as FjbDetail),
        setError,
        menuName: "create-fjb",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fjb"] });
    },
  });
};

export const useMutationUpdateFjb = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      fetchDataAsync({
        asyncFn: () => updateFjb(id, data as FjbDetail),
        setError,
        menuName: "update-fjb",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fjb"] });
    },
  });
};

export const useMutationDeleteFjb = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchDataAsync({
        asyncFn: () => deleteFjb(id),
        setError,
        menuName: "delete-fjb",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fjb"] });
    },
  });
};

export const useMutationValidateNomorMesin = () => {
  const setError = useErrorStore((s) => s.setError);
  return useMutation({
    mutationFn: (nomorMesin: string) =>
      fetchDataAsync({
        asyncFn: () => validateNomorMesin(nomorMesin),
        setError,
        menuName: "validate-mesin",
      }),
  });
};

// Master data queries
export const useQueryMasterCabang = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "cabang"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterCabang,
        setError,
        menuName: "master-cabang",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterTipeFjb = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "tipeFjb"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterTipeFjb,
        setError,
        menuName: "master-tipe-fjb",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterVarian = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "varian"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterVarian,
        setError,
        menuName: "master-varian",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterWarna = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "warna"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterWarna,
        setError,
        menuName: "master-warna",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterPekerjaan = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "pekerjaan"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterPekerjaan,
        setError,
        menuName: "master-pekerjaan",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterAgama = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "agama"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterAgama,
        setError,
        menuName: "master-agama",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterJenisKelamin = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "jenisKelamin"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterJenisKelamin,
        setError,
        menuName: "master-jk",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterJenisPit = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "jenisPit"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterJenisPit,
        setError,
        menuName: "master-jenis-pit",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterMekanik = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "mekanik"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterMekanik,
        setError,
        menuName: "master-mekanik",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterSa = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<SelectOption[]>({
    queryKey: ["master", "sa"],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: getMasterSa,
        setError,
        menuName: "master-sa",
      });
      return response?.data?.data ?? [];
    },
  });
};

export const useQueryMasterJasa = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ["master", "jasa"],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: getMasterJasa,
        setError,
        menuName: "master-jasa",
      }),
  });
};

export const useQueryMasterPart = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ["master", "part"],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: getMasterPart,
        setError,
        menuName: "master-part",
      }),
  });
};