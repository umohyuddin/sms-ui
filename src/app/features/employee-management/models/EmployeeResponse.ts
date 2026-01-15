export interface EmployeeResponse {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  middleName:string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;       // ISO date string, e.g., "1990-05-12"
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  cnic?: string;
  passportNumber?: string;
  religion?: string;
  nationality?: string;
  bloodGroup?: string;
  joiningDate: string;       // ISO date string
  probationEndDate?: string; // optional
  primaryPhone?: string;
  secondaryPhone?: string;
  workPhone?: string;
  profilePicture?: string;
  bio?: string;
  active: boolean;
  email: string;
  employeeTypeId:number;
  employeeTypeName:string
}

