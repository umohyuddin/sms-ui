export interface TaxTypeResponse {
  id: number;
  code: string;
  name: string;
  taxPercentage: number;
  countryId: number;
  isActive: boolean;
}
