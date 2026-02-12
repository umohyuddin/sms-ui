export interface StudentAttendance {
  id?: number;
  organizationId: number;
  studentId: number;
  standardId: number;
  sectionId: number;
  attendanceDate: Date | string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
  markedBy?: number;
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
  studentName?: string;
  studentRollNo?: string;
  standardName?: string;
  sectionName?: string;
  markedByName?: string;
}

export interface AttendanceMarkingRequest {
  organizationId: number;
  standardId: number;
  sectionId: number;
  attendanceDate: Date | string;
  attendances: {
    studentId: number;
    status: 'PRESENT' | 'ABSENT' | 'LEAVE';
    remarks?: string;
  }[];
}

export interface AttendanceStatistics {
  totalStudents: number;
  present: number;
  absent: number;
  leave: number;
  attendancePercentage: number;
}
