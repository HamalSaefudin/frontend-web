import { useQuery } from '@tanstack/react-query';
import { fetchBranches } from '@/services/master-service';
import type { Branch } from '@/services/master-service';

export type { Branch };

export const useBranchData = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });
};
