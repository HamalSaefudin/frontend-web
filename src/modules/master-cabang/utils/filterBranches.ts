import type { Branch } from '@/services/master-cabang';

export interface BranchFilterCriteria {
  kodeCabang?: string;
  namaCabang?: string;
  namaLead?: string;
}

export const filterBranches = (
  branches: Branch[],
  criteria: BranchFilterCriteria,
): Branch[] => {
  return branches.filter((branch) => {
    // Apply AND logic: all provided filters must match
    if (
      criteria.kodeCabang &&
      !branch.kodeCabang
        .toLowerCase()
        .includes(criteria.kodeCabang.toLowerCase())
    ) {
      return false;
    }

    if (
      criteria.namaCabang &&
      !branch.namaCabang
        .toLowerCase()
        .includes(criteria.namaCabang.toLowerCase())
    ) {
      return false;
    }

    if (
      criteria.namaLead &&
      !branch.namaLead
        .toLowerCase()
        .includes(criteria.namaLead.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
};
