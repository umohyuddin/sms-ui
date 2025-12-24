export interface EmployeeAddress {
  id: number;
  employeeId: number;
  addressType: string;
  line1: string;
  line2?: string;

  cityId: number;
  cityName: string;

  provinceId?: number;
  provinceName?: string;

  postalCode?: string;

  countryId: number;
  countryName: string;
}