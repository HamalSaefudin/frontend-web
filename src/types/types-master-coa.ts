export interface MasterCoa {
  id: string;
  coaId: string;
  coaName: string;
  branches: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CoaTransaction {
  transactionId: string;
  transactionName: string;
  category: 'TRX_IN' | 'TRX_OUT';
  subgroup: string;
  group: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterCoaDetail extends MasterCoa {
  transactions: CoaTransaction[];
}

export interface CreateMasterCoaRequest {
  coaName: string;
  branches: string[];
  transactions: {
    transactionName: string;
    category: 'TRX_IN' | 'TRX_OUT';
    subgroup?: string;
    group?: string;
  }[];
}

export interface UpdateMasterCoaRequest {
  coaName: string;
  branches: string[];
  transactions: {
    transactionName: string;
    category: 'TRX_IN' | 'TRX_OUT';
    subgroup?: string;
    group?: string;
  }[];
}

export interface CopyMasterCoaRequest {
  branches: string[];
}

// Error codes
export const COA_ERRORS = {
  COA_NOT_FOUND: 'COA_NOT_FOUND',
  BRANCH_ALREADY_USED: 'BRANCH_ALREADY_USED',
  INVALID_STATE: 'INVALID_STATE',
  COA_ALREADY_USED: 'COA_ALREADY_USED',
  INVALID_COA_NAME: 'INVALID_COA_NAME',
  TRANSACTION_ALREADY_USED: 'TRANSACTION_ALREADY_USED',
} as const;