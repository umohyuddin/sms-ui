export interface Province {
  id: number;
  code: string | null;
  name: string | null;
  description: string | null;
  isActive: boolean | null;
}

export interface City {
  id: number;
  provinceId: number | null;
  name: string | null;
  code: string | null;
  isActive: boolean | null;
  deleted: boolean | null;
}

export interface Campus {
  id: number;
  instituteId: number;
  campusName: string;
  campusCode: string | null;
  contactNumber: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  provinceId: number;
  cityId: number;
  province: Province;
  city: City;
  active: boolean;
}

export interface Standard {
  id: number;
  standardName: string;
  standardCode: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt: string | null;
  campusId: number;
  campus: Campus;
}

export interface SectionResponse {
  id: number;
  sectionName: string;
  sectionCode: string | null;
  description: string | null;
  standard: Standard;
  deleted: boolean;
  deletedAt: string | null;
}
