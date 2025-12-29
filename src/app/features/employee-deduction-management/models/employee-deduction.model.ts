export interface EmployeeDeduction {
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  deductions: Deduction[];
}

export interface Deduction {
  id: number;
  deductionType: string;
  amount: number;
  description: string;
  effectiveDate: string;
  status: string;
}