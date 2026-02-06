export interface FacilityTypeResponse {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  active?: boolean;
  deleted?: boolean;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}
