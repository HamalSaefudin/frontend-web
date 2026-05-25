import { useQuery } from '@tanstack/react-query';
import { fetchBranches } from '@/services/master-service';
import type { Branch } from '@/services/master-service';
import { fetchDataAsync } from '@/utils';
import { useErrorStore } from '@/store/useErrorStore';

export type { Branch };

export const useBranchData = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ['branches'],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: fetchBranches,
        setError,
        menuName: 'branches',
      }),
  });
};