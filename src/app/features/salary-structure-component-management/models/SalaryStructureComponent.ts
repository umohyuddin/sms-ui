export interface SalaryStructureComponent {
  id: number;
  salaryStructureId: number;
  salaryStructureName?: string | null;
  componentId: number;
  componentName: string;
  componentType: string;
  isPercentage?: boolean | null;
  value: number;
  calculatedAmount:number
}