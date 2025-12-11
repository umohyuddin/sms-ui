// student-fee-summary.model.ts
export interface StudentFeeSummaryResponse {
  id: number;

  totalAssignedFee: number;
  totalPaid: number;
  balance: number;

  studentId: number;
  studentFullName?: string; // optional

  academicYearId: number;
  academicYearName?: string; // optional
}
