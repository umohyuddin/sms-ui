export interface EmployeeSalary {
  id: number | null;
  salaryId: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  employeeType: string | null;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  effectiveDate: string;
  salaryStructureId: number | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}