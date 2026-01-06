export interface StudentDiscountAssignmentResponse {

  // ===== Assignment =====
  id: number;
  studentId: number;
  studentName: string;

  campusId: number;

  academicYearId: number;
  academicYearName: string;

  assignmentActive: boolean;

  appliedAmount: number | null;
  appliedPercentage: number | null;

  isActive: boolean | null;
  reason: string | null;

  createdAt: string; // ISO DateTime

  // ===== Discount Rate =====
  discountRateId: number;
  isPercentage: boolean;
  discountValue: number | null;

  effectiveFrom: string; // yyyy-mm-dd
  effectiveTo: string;   // yyyy-mm-dd
  discountRateActive: boolean;

  // ===== Discount Sub Type =====
  discountSubTypeId: number;
  discountSubTypeCode: string;
  discountSubTypeName: string;
  discountSubTypeDisplayOrder: number;

  // ===== Discount Type =====
  discountTypeId: number;
  discountTypeCode: string;
  discountTypeName: string;
  chargeType: string; // PERCENTAGE | FIXED
  discountTypePriority: number;
  discountTypeDisplayOrder: number;
}
