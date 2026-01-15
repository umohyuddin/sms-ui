 export interface SalaryStructureDetails {
  id: number;
  employeeTypeName: string;
  baseSalary: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  components: SalaryComponent[];
   totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  totalWithoutDeduction:number
}

interface SalaryComponent {
  id: number;
  componentName: string;
  componentType: string;
  isPercentage: boolean;
  value: number;
}