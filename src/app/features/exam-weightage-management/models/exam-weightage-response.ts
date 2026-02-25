export interface ExamWeightageResponse {
    id: number;
    standardId: number;
    examTermId: number;
    weightage: number;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}
