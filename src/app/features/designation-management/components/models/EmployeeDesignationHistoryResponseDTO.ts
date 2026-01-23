export interface EmployeeDesignationHistoryResponseDTO {
  id: number;
  employeeId: number;
  designationId: number;
  designationName: string;
  departmentId?: number;   // optional (can be null)  
  startDate: string; // ISO LocalDateTime
  endDate: string | null;
  createdBy: number;
  createdAt: string; 
    isCurrent: boolean;
}