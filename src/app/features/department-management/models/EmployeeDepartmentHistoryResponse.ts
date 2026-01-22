export interface EmployeeDepartmentHistoryResponse {
  id: number;

  employeeId: number;
  employeeName: string | null;

  departmentId: number;
  departmentName: string;

  startDate: string; // ISO LocalDateTime
  endDate: string | null;

  isCurrent: boolean;

  createdBy: number;
  createdAt: string; // ISO LocalDateTime
}
