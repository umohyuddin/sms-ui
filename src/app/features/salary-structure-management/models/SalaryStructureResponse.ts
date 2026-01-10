export interface SalaryStructureResponse {
  id: number;
  employeeTypeId: number;
  employeeTypeName: string;
  baseSalary: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  isCurrent?: boolean;
}