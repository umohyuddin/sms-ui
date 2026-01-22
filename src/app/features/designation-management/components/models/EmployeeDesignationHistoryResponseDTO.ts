export interface EmployeeDesignationHistoryResponseDTO {
  id: number;
  employeeId: number;
  designationId: number;
  designationName: string;
  departmentId?: number;   // optional (can be null)
  isCurrent: boolean;
}