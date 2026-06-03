import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLokasiDetail,
  createLokasi,
  updateLokasi,
  deleteLokasi,
  updateLokasiStatus,
  filterLokasi,
  type LokasiWarehouse,
  type LokasiFilterParams,
} from '../../../services/master-locator';
import type { LokasiFilterInput } from '../utils/validationSchemas';
import { fetchDataAsync } from '@frontend/shared';
import { useErrorStore } from '@frontend/shared/store/useErrorStore';

export type { LokasiWarehouse, LokasiFilterParams, LokasiFilterInput };

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 5;

// Query hooks
export const useLokasiList = (params?: LokasiFilterParams) => {
  const setError = useErrorStore((s) => s.setError);
  // Always use filterLokasi with default pagination (page=1, size=5)
  // Merge provided params with defaults
  const queryParams: LokasiFilterParams = {
    page: DEFAULT_PAGE,
    size: DEFAULT_SIZE,
    ...params,
  };
  
  return useQuery({
    queryKey: ['lokasi', 'filter', queryParams],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => filterLokasi(queryParams),
        setError,
        menuName: 'lokasi-list',
      }),
    staleTime: 0,  // Always fetch fresh data
    refetchOnWindowFocus: false,
  });
};

export const useLokasiDetail = (id: string) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ['lokasi', id],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => getLokasiDetail(id),
        setError,
        menuName: 'lokasi-detail',
      }),
    enabled: !!id,
  });
};

// Mutation hooks
export const useMutationCreateLokasi = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LokasiWarehouse, 'id'>) =>
      fetchDataAsync({
        asyncFn: () => createLokasi(data),
        setError,
        menuName: 'create-lokasi',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lokasi'] });
    },
  });
};

export const useMutationUpdateLokasi = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<LokasiWarehouse, 'id'> }) =>
      fetchDataAsync({
        asyncFn: () => updateLokasi(id, data),
        setError,
        menuName: 'update-lokasi',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lokasi'] });
    },
  });
};

export const useMutationDeleteLokasi = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchDataAsync({
        asyncFn: () => deleteLokasi(id),
        setError,
        menuName: 'delete-lokasi',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lokasi'] });
    },
  });
};

export const useMutationUpdateLokasiStatus = () => {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' }) =>
      fetchDataAsync({
        asyncFn: () => updateLokasiStatus(id, status),
        setError,
        menuName: 'update-lokasi-status',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lokasi'] });
    },
  });
};