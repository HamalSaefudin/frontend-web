import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEkspedisiInventoryDetail,
  fetchEkspedisiInventoryList,
  processEkspedisiInventory,
  type EkspedisiInventoryDetail,
  type EkspedisiInventoryFilters,
  type EkspedisiInventoryProcessPayload,
} from "../../../services/ekspedisi-inventory";
import { fetchDataAsync } from "@frontend/shared";
import { useErrorStore } from "@frontend/shared/store/useErrorStore.ts";

export function useQueryEkspedisiInventoryList(
  page: number,
  pageSize: number,
  filters: EkspedisiInventoryFilters,
) {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ["ekspedisi-inventory-list", page, pageSize, filters],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => fetchEkspedisiInventoryList(page, pageSize, filters),
        setError,
        menuName: "ekspedisi-inventory-list",
      }),
  });
}

export function useQueryEkspedisiInventoryDetail(id?: string | null) {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ["ekspedisi-inventory-detail", id],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => fetchEkspedisiInventoryDetail(id ?? ""),
        setError,
        menuName: "ekspedisi-inventory-detail",
      }),
    enabled: !!id,
  });
}

export function useMutationProcessEkspedisiInventory() {
  const setError = useErrorStore((s) => s.setError);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: EkspedisiInventoryProcessPayload) =>
      fetchDataAsync({
        asyncFn: () => processEkspedisiInventory(payload),
        setError,
        menuName: "process-ekspedisi-inventory",
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["ekspedisi-inventory-list"] });
      qc.invalidateQueries({ queryKey: ["ekspedisi-inventory-detail", variables.id] });
    },
  });
}

export type { EkspedisiInventoryDetail };