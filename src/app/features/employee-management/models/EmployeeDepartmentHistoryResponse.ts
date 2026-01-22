export interface EmployeeDepartmentHistoryResponse {
  id: number;

  employeeId: number;
  employeeName?: string; // optional, same as in Java

  departmentId: number;
  departmentName: string;

  startDate: string; // ISO string from backend (LocalDateTime)
  endDate?: string;  // optional, can be null

  isCurrent: boolean;
  createdBy: number;
  createdAt: string; // ISO string from backend
}