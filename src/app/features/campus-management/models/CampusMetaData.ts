export interface CampusMetaData {
  institute: InstituteResponseDTO;
  provinces: ProvinceResponseDTO[];
}

 interface InstituteResponseDTO {
  id: number;
  name: string;
  countryId: number;
  // add other fields as needed
}

 interface ProvinceResponseDTO {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  // add other fields as needed
}
