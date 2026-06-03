import type { SelectOption } from "@frontend/ui";
import type { EkspedisiInventoryStatus } from "../../../services/ekspedisi-inventory";

export const EKSPEDISI_INVENTORY_STATUS_OPTIONS: Array<SelectOption & { value: EkspedisiInventoryStatus | "" }> = [
  { value: "", label: "Semua Status" },
  { value: "DRAFT", label: "DRAFT" },
  { value: "PROCESSED", label: "PROCESSED" },
  { value: "CANCELLED", label: "CANCELLED" },
];

