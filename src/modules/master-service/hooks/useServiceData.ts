import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/services/master-service';
import type { Service } from '@/services/master-service';

export type { Service };

export const useServiceData = (branchId?: string) => {
  return useQuery({
    queryKey: ['services', branchId],
    queryFn: () => fetchServices(branchId),
    enabled: !!branchId,
  });
};
