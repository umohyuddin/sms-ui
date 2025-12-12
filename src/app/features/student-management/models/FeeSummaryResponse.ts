export interface StudentFeePayment {
  id: number;
  studentId: number;
  studentFullName?: string;

  paymentDate: string;
  amountPaid: number;

  paymentMonth: string;
  paymentYear: number;

  paymentMode: string;

  createdAt: string;

  academicYearId: number;
  academicYearName?: string;
}

export interface StudentFeeSummaryResponse {
  id: number;

  totalAssignedFee: number;
  totalPaid: number;
  balance: number;

  studentId: number;
  studentFullName?: string;

  academicYearId: number;
  academicYearName?: string;

  studentFeePaymentsList: StudentFeePayment[];
}

