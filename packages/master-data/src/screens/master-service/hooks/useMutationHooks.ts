import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createService, updateService, deleteService } from '../../../services/master-service';
import type { Service } from './useServiceData';
import { fetchDataAsync } from '@frontend/shared';
import { useErrorStore } from '@frontend/shared/store/useErrorStore';

export const useCreateService = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Service, 'id'>) =>
      fetchDataAsync({
        asyncFn: () => createService(data),
        setError,
        menuName: 'create-service',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useUpdateService = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id: serviceId, data }: { id: string; data: Omit<Service, 'id'> }) =>
      fetchDataAsync({
        asyncFn: () => updateService(serviceId, data),
        setError,
        menuName: 'update-service',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useDeleteService = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      fetchDataAsync({
        asyncFn: () => deleteService(id),
        setError,
        menuName: 'delete-service',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['services'] });
    },
  });
};