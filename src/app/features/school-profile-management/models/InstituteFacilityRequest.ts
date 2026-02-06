export interface InstituteFacilityRequest {
  instituteId: number;
  facilityTypeId?: number;
  name: string;
  description?: string;
  capacity?: number;
  location?: string;
  isActive?: boolean;
}
