export interface EmployeeAttendance {
  id?: number;
  organizationId: number;
  employeeId: number;
  attendanceDate: Date | string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY';
  remarks?: string;
  
  isActive: boolean;
  isDeleted: boolean;
  
  createdAt?: Date;
  createdBy?: number;
  updatedAt?: Date;
  updatedBy?: number;
  deletedAt?: Date;
  deletedBy?: number;
  
  // Display fields
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  designationName?: string;
}

export interface EmployeeAttendanceMarkingRequest {
  organizationId: number;
  attendanceDate: Date | string;
  attendances: {
    employeeId: number;
    status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY';
    remarks?: string;
  }[];
}

export interface EmployeeAttendanceStatistics {
  totalEmployees: number;
  present: number;
  absent: number;
  leave: number;
  halfDay: number;
  attendancePercentage: number;
}
