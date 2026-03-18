export interface ConcessionRateRequest {
  discountSubTypeId: number;
  campusId?: number | null;
  academicYearId?: number | null;
  chargeTypeId: number;
  value: number;
  isPercentage: boolean;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo: string; // YYYY-MM-DD
  isActive: boolean;
}
