export interface DiscountRate {
    id: number;
    value: number;
    isPercentage: boolean;
    effectiveFrom: string; // or Date if you parse it
    effectiveTo: string;   // or Date if you parse it
    isActive: boolean;
    discountSubType: DiscountSubType;
    campus: Campus;
    academicYear: AcademicYear;
}

export interface DiscountSubType {
    id: number;
    code: string;
    name: string;
    description?: string;
    discountType: DiscountType;
    isActive: boolean;
}

export interface DiscountType {
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
    province?: Province;
    city?: City;
    active?: boolean;
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
