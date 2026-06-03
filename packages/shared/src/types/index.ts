// Generic API types

// Base response for all API calls
export interface IBaseResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
  };
}

export interface IPaginatedDataResponse<T> {
  items: T[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface IApiError {
  status: number;
  message: string;
  code?: string;
}

// Reusable dropdown option
export interface SelectOption {
  value: string;
  label: string;
}

// ============================================================
// Re-export types commonly used across the app
// ============================================================

// Auth types - re-export entire module
export * from './types-auth';

// Dashboard types
export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
  createdAt: string
}

export interface Stats {
  totalLeads: number
  convertedLeads: number
  pendingLeads: number
  conversionRate: number
}

export interface Report {
  id: string
  title: string
  createdAt: string
  author: string
  status: 'draft' | 'published'
}

export interface Settings {
  theme: 'light' | 'dark'
  notifications: boolean
  language: string
  timezone: string
}

// PDI types - re-export entire module
export * from './types-pdi';

// MasterKas types - re-export entire module
export * from './types-master-kas';