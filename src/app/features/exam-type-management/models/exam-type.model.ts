export interface ExamTypeRequestDTO {
    id?: number;
    code: string;
    name: string;
    active: boolean;
    organizationId?: number;
    description?: string;
}

export interface ExamTypeResponseDTO {
    id: number;
    code: string;
    name: string;
    active: boolean;
    description?: string;
}

export interface ExamType extends ExamTypeResponseDTO { }
