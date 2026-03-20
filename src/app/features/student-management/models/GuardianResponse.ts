export interface GuardianResponse {
  id: number;
  campusId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  relationId: number;
  cnic: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  occupation?: string;
  organization?: string;
  address?: string;
  isActive: boolean;
  status?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
