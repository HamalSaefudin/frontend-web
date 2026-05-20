import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLokasiList,
  getLokasiDetail,
  createLokasi,
  updateLokasi,
  deleteLokasi,
  updateLokasiStatus,
  type LokasiWarehouse,
  type LokasiFilterParams,
} from '@/services/master-locator';
import type { LokasiFilterInput } from '../utils/validationSchemas';

export type { LokasiWarehouse, LokasiFilterParams, LokasiFilterInput };

// Query hooks
export const useLokasiList = (params?: LokasiFilterParams) => {
  return useQuery({
    queryKey: ['lokasi', params],
    queryFn: () => getLokasiList(params),
  });
};

export const useLokasiDetail = (id: string) => {
  return useQuery({
    queryKey: ['lokasi', id],
    queryFn: () => getLokasiDetail(id),
    enabled: !!id,
  });
};

// Mutation hooks
export const useMutationCreateLokasi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LokasiWarehouse, 'id'>) => createLokasi(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lokasi'] });
    },
  });
};

export const useMutationUpdateLokasi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<LokasiWarehouse, 'id'> }) =>
      updateLokasi(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lokasi'] });
    },
  });
};

export const useMutationDeleteLokasi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLokasi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lokasi'] });
    },
  });
};

export const useMutationUpdateLokasiStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' }) =>
      updateLokasiStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lokasi'] });
    },
  });
};