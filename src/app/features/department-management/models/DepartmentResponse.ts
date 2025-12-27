export interface DepartmentResponse {
    id: number;
    departmentCode: string;
    departmentName: string;
    description: string;
    parentDepartmentName?: string; // optional
    headEmployeeName?: string;
    parentDepartmentId: number | null;
    headEmployeeId: number;
    active: boolean;
}
