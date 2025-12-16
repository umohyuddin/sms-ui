export interface StudentFeeSummaryResponse {
    id: number;
    totalAssignedFee: number;
    totalPaid: number;
    balance: number;
    studentId: number;
    studentFullName: string;
    academicYearId: number;
    academicYearName: string;
    academicStartDate: string; // ISO string
    academicEndDate: string; // ISO string
    academicTotalMonths: number;
    monthlyFeeDecimal: number;
    monthsNames: string[];
    studentFeePaymentsList?: StudentFeePayment[]; // optional
    monthlyPayments?: MonthlyPayment[]; // optional
}

export interface StudentFeePayment {
    id: number;
    studentId: number;
    studentFullName?: string; // optional
    paymentDate: string; // ISO string
    amountPaid: number;
    paymentMonth: string;
    paymentYear: number;
    paymentMode?: string; // optional
    createdAt?: string; // optional
    academicYearId: number;
    academicYearName?: string; // optional
}

export interface MonthlyPayment {
    month: string;
    totalPaid: number;
    totalPaidSoFar: number;
    totalMonthlyFee: number;
    status: 'Paid' | 'Partial' | 'Unpaid';
    partialPayments?: PartialPayment[]; // optional
}

export interface PartialPayment {
    id: number;
    paymentDate: string; // ISO string
    amountPaid: number;
    paymentMode?: string; // optional
}
