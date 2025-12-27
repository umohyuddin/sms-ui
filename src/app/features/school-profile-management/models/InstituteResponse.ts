export interface InstituteResponse {
  id?: number;

  name: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  website?: string;
  tagLine?: string;

  logo?: Uint8Array | null;
  establishedDate?: string; // ISO format: YYYY-MM-DD

  countryId: number;
  provinceId: number;
  cityId: number;

  countryName?: string;
  provinceName?: string;
  cityName?: string;
  campusCount:number;
}