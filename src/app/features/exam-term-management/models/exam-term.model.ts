export interface ExamTermRequestDTO {
    id?: number | null;
    name: string;
    sequenceNo: number;
    academicYearId: number;
    active: boolean;
}

export interface ExamTermResponseDTO {
    id: number;
    name: string;
    sequenceNo: number;
    academicYearId: number;
    academicYearName: string;
    active: boolean;
}

export interface ExamTerm extends ExamTermResponseDTO { }
