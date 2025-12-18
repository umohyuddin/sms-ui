export interface EmployeeAddress {
  id: number;
  employeeId: number;
  addressType: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}