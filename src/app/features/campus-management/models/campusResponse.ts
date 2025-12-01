

export interface CampusResponse {
  id: number;
  instituteId: number;
  campusName: string;
  campusCode?: string | null;
  contactNumber?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  logo?: string | null; // can be base64 or URL
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  deleted: boolean;
  provinceId?: number | null;
  cityId?: number | null;
  active: boolean;
  province?: Province;
  city?: City;
}

export interface Province {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface City {
  id: number;
  provinceId: number;
  name: string;
  code: string;
  isActive: boolean;
  deleted: boolean;
}
