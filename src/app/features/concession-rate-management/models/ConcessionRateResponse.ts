export interface ConcessioSubType {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: ConcessionType;
  isActive: boolean;
}

export interface ConcessionType {
  chargeType: string;
  chargeTypeLabel?: string | null;
  recurrenceRule: string;
  recurrenceRuleLabel?: string | null;
  name: string;
  id: number;
}

export interface ConcessionRateResponse {
  id: number;
  discountSubType: ConcessioSubType;
  campusId?: number | null;
  campusName?: string | null;
  academicYearId: number;
  academicYearName: string;
  value: number;
  percentage: number;
  isPercentage: boolean;
  effectiveFrom: string; // ISO Date string
  effectiveTo: string;   // ISO Date string
  isActive: boolean;
}

