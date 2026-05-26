import {
  createBranch,
  deleteBranch,
  fetchBranchById,
  fetchBranches,
  importBranches,
  updateBranch,
  type Branch,
} from '@/services/master-cabang';
import { useErrorStore } from '@/store/useErrorStore';
import { fetchDataAsync } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type { Branch };

// Query hooks
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

export const useQueryCabangById = (id: string) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery<Branch | null>({
    queryKey: ['cabang', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetchDataAsync({
        asyncFn: () => fetchBranchById(id),
        setError,
        menuName: 'cabang-detail',
      });
      return response?.data?.data ?? null;
    },
    enabled: !!id,
  });
};

// Mutation hooks
export const useMutationCreateCabang = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Branch, 'id'>) =>
      fetchDataAsync({
        asyncFn: () => createBranch(data),
        setError,
        menuName: 'create-cabang',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cabang'] });
    },
  });
};

export const useMutationUpdateCabang = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Branch, 'id'> }) =>
      fetchDataAsync({
        asyncFn: () => updateBranch(id, data),
        setError,
        menuName: 'update-cabang',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cabang'] });
    },
  });
};

export const useMutationDeleteCabang = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchDataAsync({
        asyncFn: () => deleteBranch(id),
        setError,
        menuName: 'delete-cabang',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cabang'] });
    },
  });
};

export const useMutationImportCabang = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      fetchDataAsync({
        asyncFn: () => importBranches(file),
        setError,
        menuName: 'import-cabang',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cabang'] });
    },
  });
};