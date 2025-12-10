export interface ActiveDiscountRateFullResponse {
  id: number;
  name?: string; // optional, e.g., "Multi-Child Scheme"
  components: DiscountComponent[];
}

export interface DiscountComponent {
  id: number;
  name?: string; // optional, e.g., "Multi-Child Scheme"
  rates: DiscountRate[];
  randomClass?: string;
}

export interface DiscountRate {
  id: number;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  value: number;
  isPercentage: boolean;
  effectiveFrom: string;
  effectiveTo?: string | null;
  isActive: boolean;
  discountSubType: DiscountSubTypeInfo;
  campus: Campus;
  academicYear: AcademicYear;
}

export interface DiscountSubTypeInfo {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  discountType: DiscountTypeInfo;
}

export interface DiscountTypeInfo {
  id: number;
  name: string;
  chargeType?: string | null;
  chargeTypeLabel?: string | null;
  recurrenceRule?: string | null;
  recurrenceRuleLabel?: string | null;
}

export interface Campus {
  id: number;
  instituteId: number;
  campusName: string;
  campusCode?: string | null;
  contactNumber?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  logo?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  provinceId?: number;
  cityId?: number;
  active?: boolean;
  province?: Province;
  city?: City;
}

export interface Province {
  id: number;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  isActive?: boolean | null;
}

export interface City {
  id: number;
  provinceId?: number | null;
  name?: string | null;
  code?: string | null;
  isActive?: boolean | null;
  deleted?: boolean | null;
}

export interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}
