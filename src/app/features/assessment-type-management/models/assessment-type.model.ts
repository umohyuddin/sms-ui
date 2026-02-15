export interface AssessmentTypeRequestDTO {
    id?: number;
    code: string;
    name: string;
    description?: string;
    active: boolean;
}

export interface AssessmentTypeResponseDTO {
    id: number;
    code: string;
    name: string;
    description: string;
    active: boolean;
}

export interface AssessmentType {
    id: number;
    code: string;
    name: string;
    description: string;
    active: boolean;
}
