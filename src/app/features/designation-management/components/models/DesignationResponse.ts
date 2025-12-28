export interface DesignationResponse {
  id: number;
  designationCode: string;
  designationName: string;
  description: string;
  departmentId: number | null;
  departmentName: string | null;
  employeeTypeId: number;
  employeeTypeName: string;
  active: boolean;
}
