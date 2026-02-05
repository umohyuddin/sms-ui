export interface InstituteAccreditationResponseDTO {
    id: number;
    instituteId: number;
    authorityName: string;
    licenseNumber: string;
    validFrom: string; // LocalDate is handled as string in JSON (ISO format)
    validTo: string;
    isActive: boolean;
}

export interface InstituteAccreditationCreateRequestDTO {
    instituteId: number;
    authorityName?: string;
    licenseNumber?: string;
    validFrom?: string;
    validTo?: string;
    isActive?: boolean;
}

export interface InstituteAccreditationUpdateRequestDTO extends Partial<InstituteAccreditationCreateRequestDTO> {
}
