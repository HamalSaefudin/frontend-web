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

export type { MasterCoa, MasterCoaDetail };
export {
  type CreateMasterCoaRequest,
  type UpdateMasterCoaRequest,
  type CopyMasterCoaRequest,
};

export const useQueryCabang = () => {
  return useQuery({
    queryKey: ['cabang'],
    queryFn: () => fetchBranches(),
  });
};

// Query hooks
export const useQueryMasterCoaList = (
  keyword?: string,
  status?: string,
  page = 0,
  size = 10
) => {
  return useQuery({
    queryKey: ['master-coas', keyword, status, page, size],
    queryFn: () => fetchMasterCoas(keyword, status, page, size),
  });
};

export const useQueryMasterCoaDetail = (coaId: string) => {
  return useQuery({
    queryKey: ['master-coa', coaId],
    queryFn: () => fetchMasterCoaById(coaId),
    enabled: !!coaId,
  });
};

// Mutation hooks
export const useMutationCreateMasterCoa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMasterCoaRequest) => createMasterCoa(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
    },
  });
};

export const useMutationUpdateMasterCoa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ coaId, data }: { coaId: string; data: UpdateMasterCoaRequest }) =>
      updateMasterCoa(coaId, data),
    onSuccess: (_, { coaId }) => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
      queryClient.invalidateQueries({ queryKey: ['master-coa', coaId] });
    },
  });
};

export const useMutationActivateMasterCoa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coaId: string) => activateMasterCoa(coaId),
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coaId: string) => deactivateMasterCoa(coaId),
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ coaId, data }: { coaId: string; data: CopyMasterCoaRequest }) =>
      copyMasterCoa(coaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
    },
  });
};

export const useMutationDeleteMasterCoa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coaId: string) => deleteMasterCoa(coaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-coas'] });
    },
  });
};