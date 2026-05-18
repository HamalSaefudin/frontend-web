import { useMutation } from '@tanstack/react-query';
import { createService, updateService, deleteService } from '@/services/master-service';
import type { Service } from './useServiceData';

export const useCreateService = () => {
  return useMutation({
    mutationFn: createService,
  });
};

export const useUpdateService = () => {
  return useMutation({
    mutationFn: ({ id: serviceId, data }: { id: string; data: Omit<Service, 'id'> }) =>
      updateService(serviceId, data),
  });
};

export const useDeleteService = () => {
  return useMutation({
    mutationFn: deleteService,
  });
};
