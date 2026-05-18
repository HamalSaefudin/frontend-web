import { useQuery, useMutation } from '@tanstack/react-query';
import {
  fetchBranches,
  fetchBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  importBranches,
  type Branch,
} from '@/services/master-cabang';

export type { Branch };

// Query hooks
export const useQueryCabang = () => {
  return useQuery({
    queryKey: ['cabang'],
    queryFn: () => fetchBranches(),
  });
};

export const useQueryCabangById = (id: string) => {
  return useQuery({
    queryKey: ['cabang', id],
    queryFn: () => fetchBranchById(id),
    enabled: !!id,
  });
};

// Mutation hooks
export const useMutationCreateCabang = () => {
  return useMutation({
    mutationFn: (data: Omit<Branch, 'id'>) => createBranch(data),
  });
};

export const useMutationUpdateCabang = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Branch, 'id'> }) =>
      updateBranch(id, data),
  });
};

export const useMutationDeleteCabang = () => {
  return useMutation({
    mutationFn: (id: string) => deleteBranch(id),
  });
};

export const useMutationImportCabang = () => {
  return useMutation({
    mutationFn: (file: File) => importBranches(file),
  });
};
