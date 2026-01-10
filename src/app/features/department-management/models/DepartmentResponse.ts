export interface DepartmentResponse {
 id: number;
  departmentCode: string;
  departmentName: string;
  description?: string;               // optional if it can be null
  parentDepartmentId: number | null;  // parent may be null
  parentDepartmentName?: string;      // optional
  headEmployeeId?: number;            // optional if no head assigned
  headEmployeeName?: string;          // optional
  headEmployeeCode?: string;          // optional
  active: boolean;
}
