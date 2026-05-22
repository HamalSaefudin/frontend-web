import type { Branch } from '@/services/master-cabang';

/** Resolve branch codes to display labels using master cabang list. */
export function formatBranchCodes(codes: string[], cabangList: Branch[] | undefined): string {
  if (!cabangList?.length) return codes.join(', ');
  const map = new Map(cabangList.map((b) => [b.kodeCabang, b.namaCabang]));
  return codes.map((c) => map.get(c) ?? c).join(', ');
}
