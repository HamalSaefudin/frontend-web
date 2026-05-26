import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/services/master-service';
import type { Service } from '@/services/master-service';
import { fetchDataAsync } from '@/utils';
import { useErrorStore } from '@/store/useErrorStore';

export type { Service };

export const useServiceData = (branchId?: string) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ['services', branchId],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => fetchServices(branchId),
        setError,
        menuName: 'services',
      }),
    enabled: !!branchId,
  });
};