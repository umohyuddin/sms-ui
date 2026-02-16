export interface GradeScaleRequestDTO {
    id?: number;
    minPercentage: number;
    maxPercentage: number;
    grade: string;
    remarks?: string;
    points?: number;
    active: boolean;
    organizationId?: number;
}

export interface GradeScaleResponseDTO {
    id: number;
    minPercentage: number;
    maxPercentage: number;
    grade: string;
    remarks: string;
    points: number;
    active: boolean;
    organizationId: number;
}

export interface GradeScale {
    id: number;
    minPercentage: number;
    maxPercentage: number;
    grade: string;
    remarks: string;
    points: number;
    active: boolean;
}
