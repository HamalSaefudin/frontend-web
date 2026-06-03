import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Branch } from '../../../services/master-cabang';
import {
  fetchMasterCoas,
  fetchMasterCoaById,
  createMasterCoa,
  updateMasterCoa,
  activateMasterCoa,
  deactivateMasterCoa,
  copyMasterCoa,
  deleteMasterCoa,
  type MasterCoa,
  type MasterCoaDetail,
  type CreateMasterCoaRequest,
  type UpdateMasterCoaRequest,
  type CopyMasterCoaRequest,
  type PaginatedData,
} from '../../../services/master-coa';
import { fetchBranches } from '../../../services/master-cabang';
import { fetchDataAsync } from '@frontend/shared';
import { useErrorStore } from '@frontend/shared/store/useErrorStore';

export type { MasterCoa, MasterCoaDetail };
export {
  type CreateMasterCoaRequest,
  type UpdateMasterCoaRequest,
  type CopyMasterCoaRequest,
};

export const useQueryCabang = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<Branch[]>({
    queryKey: ['cabang'],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: fetchBranches,
        setError,
        menuName: 'cabang',
      });
      return response?.data?.data ?? [];
    },
  });
};

// Query hooks
export const useQueryMasterCoaList = (
  keyword?: string,
  status?: string,
  page = 0,
  size = 10
) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<PaginatedData<MasterCoa>>({
    queryKey: ['master-coas', keyword, status, page, size],
    queryFn: async () => {
      const response = await fetchDataAsync({
        asyncFn: () => fetchMasterCoas(keyword, status, page, size),
        setError,
        menuName: 'master-coa-list',
      });
      return response?.data?.data ?? { items: [], pagination: { page: 0, size: 10, totalItems: 0, totalPages: 0 } };
    },
  });
};

export const useQueryMasterCoaDetail = (coaId: string) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<MasterCoaDetail | null>({
    queryKey: ['master-coa', coaId],
    queryFn: async () => {
      if (!coaId) return null;
      const response = await fetchDataAsync({
        asyncFn: () => fetchMasterCoaById(coaId),
        setError,
        menuName: 'master-coa-detail',
      });
      return response?.data?.data ?? null;
    },
    enabled: !!coaId,
  });
};

// Mutation hooks
export const useMutationCreateMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMasterCoaRequest) =>
      fetchDataAsync({
        asyncFn: () => createMasterCoa(data),
        setError,
        menuName: 'create-master-coa',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['master-coas'] });
    },
  });
};

export const useMutationUpdateMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ coaId, data }: { coaId: string; data: UpdateMasterCoaRequest }) =>
      fetchDataAsync({
        asyncFn: () => updateMasterCoa(coaId, data),
        setError,
        menuName: 'update-master-coa',
      }),
    onSuccess: (_, { coaId }) => {
      qc.invalidateQueries({ queryKey: ['master-coas'] });
      qc.invalidateQueries({ queryKey: ['master-coa', coaId] });
    },
  });
};

export const useMutationActivateMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coaId: string) =>
      fetchDataAsync({
        asyncFn: () => activateMasterCoa(coaId),
        setError,
        menuName: 'activate-master-coa',
      }),
    onMutate: async (coaId) => {
      await qc.cancelQueries({ queryKey: ['master-coas'] });
      const previousData = qc.getQueryData(['master-coas']);
      qc.setQueryData(
        ['master-coas'],
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;
          const typedOld = old as { items?: MasterCoa[] };
          if (!typedOld.items) return old;
          return {
            ...typedOld,
            items: typedOld.items.map((coa) =>
              coa.coaId === coaId ? { ...coa, status: 'ACTIVE' } : coa
            ),
          };
        }
      );
      return { previousData };
    },
    onError: (_error, _coaId, context) => {
      if (context?.previousData) {
        qc.setQueryData(['master-coas'], context.previousData);
      }
    },
    onSettled: (_data, _error, coaId) => {
      qc.invalidateQueries({ queryKey: ['master-coas'] });
      qc.invalidateQueries({ queryKey: ['master-coa', coaId] });
    },
  });
};

export const useMutationDeactivateMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coaId: string) =>
      fetchDataAsync({
        asyncFn: () => deactivateMasterCoa(coaId),
        setError,
        menuName: 'deactivate-master-coa',
      }),
    onMutate: async (coaId) => {
      await qc.cancelQueries({ queryKey: ['master-coas'] });
      const previousData = qc.getQueryData(['master-coas']);
      qc.setQueryData(
        ['master-coas'],
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;
          const typedOld = old as { items?: MasterCoa[] };
          if (!typedOld.items) return old;
          return {
            ...typedOld,
            items: typedOld.items.map((coa) =>
              coa.coaId === coaId ? { ...coa, status: 'INACTIVE' } : coa
            ),
          };
        }
      );
      return { previousData };
    },
    onError: (_error, _coaId, context) => {
      if (context?.previousData) {
        qc.setQueryData(['master-coas'], context.previousData);
      }
    },
    onSettled: (_data, _error, coaId) => {
      qc.invalidateQueries({ queryKey: ['master-coas'] });
      qc.invalidateQueries({ queryKey: ['master-coa', coaId] });
    },
  });
};

export const useMutationCopyMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ coaId, data }: { coaId: string; data: CopyMasterCoaRequest }) =>
      fetchDataAsync({
        asyncFn: () => copyMasterCoa(coaId, data),
        setError,
        menuName: 'copy-master-coa',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['master-coas'] });
    },
  });
};

export const useMutationDeleteMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coaId: string) =>
      fetchDataAsync({
        asyncFn: () => deleteMasterCoa(coaId),
        setError,
        menuName: 'delete-master-coa',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['master-coas'] });
    },
  });
};