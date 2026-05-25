export interface LokasiWarehouse {
  id: string;
  kodeLokasi: string;
  kodeCabang: string;
  namaLokasi: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface LokasiFilterParams {
  kodeLokasi?: string;
  kodeCabang?: string;
  namaLokasi?: string;
  page?: number;
  size?: number;
}