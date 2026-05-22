import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
} from '@/services/master-coa';
import { fetchBranches } from '@/services/master-cabang';
import { fetchDataAsync } from '@/utils';
import { useErrorStore } from '@/store/useErrorStore';

export type { MasterCoa, MasterCoaDetail };
export {
  type CreateMasterCoaRequest,
  type UpdateMasterCoaRequest,
  type CopyMasterCoaRequest,
};

export const useQueryCabang = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ['cabang'],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => fetchBranches(),
        setError,
        menuName: 'cabang',
      }),
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
  return useQuery({
    queryKey: ['master-coas', keyword, status, page, size],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => fetchMasterCoas(keyword, status, page, size),
        setError,
        menuName: 'master-coa',
      }),
  });
};

export const useQueryMasterCoaDetail = (coaId: string) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ['master-coa', coaId],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => fetchMasterCoaById(coaId),
        setError,
        menuName: 'master-coa',
      }),
    enabled: !!coaId,
  });
};

// Mutation hooks
export const useMutationCreateMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMasterCoaRequest) =>
      fetchDataAsync({
        asyncFn: () => createMasterCoa(data),
        setError,
        menuName: 'master-coa',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
    },
    onError: (error: Error) => {
      console.error('[createMasterCoa] Error:', error.message);
    },
  });
};

export const useMutationUpdateMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ coaId, data }: { coaId: string; data: UpdateMasterCoaRequest }) =>
      fetchDataAsync({
        asyncFn: () => updateMasterCoa(coaId, data),
        setError,
        menuName: 'master-coa',
      }),
    onSuccess: (_, { coaId }) => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
      queryClient.invalidateQueries({ queryKey: ['master-coa', coaId] });
    },
    onError: (error: Error) => {
      console.error('[updateMasterCoa] Error:', error.message);
    },
  });
};

export const useMutationActivateMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coaId: string) =>
      fetchDataAsync({
        asyncFn: () => activateMasterCoa(coaId),
        setError,
        menuName: 'master-coa',
      }),
    onMutate: async (coaId) => {
      await queryClient.cancelQueries({ queryKey: ['master-coas'] });
      const previousData = queryClient.getQueryData(['master-coas']);
      queryClient.setQueryData(
        ['master-coas'],
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;
          const typedOld = old as { data?: { items: MasterCoa[] } };
          if (!typedOld.data?.items) return old;
          return {
            ...typedOld,
            data: {
              ...typedOld.data,
              items: typedOld.data.items.map((coa) =>
                coa.coaId === coaId ? { ...coa, status: 'ACTIVE' } : coa
              ),
            },
          };
        }
      );
      return { previousData };
    },
    onError: (_error, _coaId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['master-coas'], context.previousData);
      }
    },
    onSettled: (_data, _error, coaId) => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
      queryClient.invalidateQueries({ queryKey: ['master-coa', coaId] });
    },
  });
};

export const useMutationDeactivateMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coaId: string) =>
      fetchDataAsync({
        asyncFn: () => deactivateMasterCoa(coaId),
        setError,
        menuName: 'master-coa',
      }),
    onMutate: async (coaId) => {
      await queryClient.cancelQueries({ queryKey: ['master-coas'] });
      const previousData = queryClient.getQueryData(['master-coas']);
      queryClient.setQueryData(
        ['master-coas'],
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;
          const typedOld = old as { data?: { items: MasterCoa[] } };
          if (!typedOld.data?.items) return old;
          return {
            ...typedOld,
            data: {
              ...typedOld.data,
              items: typedOld.data.items.map((coa) =>
                coa.coaId === coaId ? { ...coa, status: 'INACTIVE' } : coa
              ),
            },
          };
        }
      );
      return { previousData };
    },
    onError: (_error, _coaId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['master-coas'], context.previousData);
      }
    },
    onSettled: (_data, _error, coaId) => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
      queryClient.invalidateQueries({ queryKey: ['master-coa', coaId] });
    },
  });
};

export const useMutationCopyMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ coaId, data }: { coaId: string; data: CopyMasterCoaRequest }) =>
      fetchDataAsync({
        asyncFn: () => copyMasterCoa(coaId, data),
        setError,
        menuName: 'master-coa',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
    },
    onError: (error: Error) => {
      console.error('[copyMasterCoa] Error:', error.message);
    },
  });
};

export const useMutationDeleteMasterCoa = () => {
  const setError = useErrorStore((s) => s.setError);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coaId: string) =>
      fetchDataAsync({
        asyncFn: () => deleteMasterCoa(coaId),
        setError,
        menuName: 'master-coa',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
    },
    onError: (error: Error) => {
      console.error('[deleteMasterCoa] Error:', error.message);
    },
  });
};