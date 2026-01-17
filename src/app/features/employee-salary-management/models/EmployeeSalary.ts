// src/app/modules/employee/models/EmployeeSalaryFullResponse.ts

export interface EmployeeSalaryFullResponse {
  id?: number;
  salaryId?: number;
  employeeId?: number;
  employeeCode?: string;
  employeeName?: string;
  employeeType?: string | null;
  grossSalary?: number;
  totalDeductions?: number;
  netSalary?: number;
  effectiveDate?: string; // ISO string
  salaryStructureId?: number;
  status?: SalaryStatus | null;
  createdAt?: string; // ISO string
  updatedAt?: string | null; // ISO string
  employee?: EmployeeMasterResponseDto | null;
  designation?: DesignationResponseDTO | null;
  department?: DepartmentResponseDTO | null;
}



export enum SalaryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
  // Add other statuses if needed
}

export interface EmployeeMasterResponseDto {
  id?: number;
  employeeCode?: string;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  fullName?: string | null;
  gender?: string | null;
  email?: string | null;
  dateOfBirth?: string | null; // ISO string
  maritalStatus?: string | null;
  religion?: string | null;
  nationality?: string | null;
  bloodGroup?: string | null;
  joiningDate?: string | null; // ISO string
  probationEndDate?: string | null; // ISO string
  primaryPhone?: string | null;
  secondaryPhone?: string | null;
  workPhone?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  active?: boolean | null;
  employeeTypeId?: number | null;
  employeeTypeName?: string;
}

export interface DesignationResponseDTO {
  id?: number;
  designationName?: string;
  // Add other fields if any
}

export interface DepartmentResponseDTO {
  id?: number;
  departmentName?: string;
  // Add other fields if any
}

