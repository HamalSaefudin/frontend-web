import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEkspedisiInventoryDetail,
  fetchEkspedisiInventoryList,
  processEkspedisiInventory,
  type EkspedisiInventoryDetail,
  type EkspedisiInventoryFilters,
  type EkspedisiInventoryProcessPayload,
} from "@/services/ekspedisi-inventory";

export function useQueryEkspedisiInventoryList(
  page: number,
  pageSize: number,
  filters: EkspedisiInventoryFilters,
) {
  return useQuery({
    queryKey: ["ekspedisi-inventory-list", page, pageSize, filters],
    queryFn: () => fetchEkspedisiInventoryList(page, pageSize, filters),
  });
}

export function useQueryEkspedisiInventoryDetail(id?: string | null) {
  return useQuery({
    queryKey: ["ekspedisi-inventory-detail", id],
    queryFn: () => fetchEkspedisiInventoryDetail(id ?? ""),
    enabled: !!id,
  });
}

export function useMutationProcessEkspedisiInventory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: EkspedisiInventoryProcessPayload) => processEkspedisiInventory(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["ekspedisi-inventory-list"] });
      qc.invalidateQueries({ queryKey: ["ekspedisi-inventory-detail", variables.id] });
    },
  });
}

export type { EkspedisiInventoryDetail };

