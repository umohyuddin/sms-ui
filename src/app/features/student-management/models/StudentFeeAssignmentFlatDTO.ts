export interface StudentFeeAssignmentFlatDTO {

  // Student
  studentId: number;
  studentCode: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Campus
  campusId: number | null;
  campusName: string | null;

  // Standard
  standardId: number | null;
  standardName: string | null;

  // Section
  sectionId: number | null;
  sectionName: string | null;

  // Academic Year
  academicYearId: number;
  academicYearName: string;

  // Assignment
  assignmentId: number;
  totalAmount: number;
  assignedDate: string; // ISO date (yyyy-MM-dd)
  dueDate: string;      // ISO date (yyyy-MM-dd)

  // Fee Rate
  feeRateId: number;
  feeAmount: number;
  currency: string | null;
  feeEffectiveFrom: string;
  feeEffectiveTo: string;

  // Fee Component
  feeComponentId: number;
  feeComponentCode: string;
  feeComponentName: string;
  discountable: boolean;
  taxable: boolean;

  // Fee Catalog
  feeCatalogId: number;
  feeCatalogCode: string;
  feeCatalogName: string;
  feeCatalogChargeType: 'FIXED' | 'VARIABLE';
  feeCatalogRecurrenceRule:
    | 'ONE_TIME'
    | 'MONTHLY'
    | 'BI_MONTHLY'
    | 'QUARTERLY'
    | 'HALF_YEARLY'
    | 'YEARLY';
}
