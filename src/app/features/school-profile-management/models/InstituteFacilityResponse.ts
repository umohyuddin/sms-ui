export interface InstituteFacilityResponse {
  id: number;
  instituteId: number;
  facilityTypeId?: number;
  facilityTypeName?: string;
  name: string;
  description?: string;
  capacity?: number;
  location?: string;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}
