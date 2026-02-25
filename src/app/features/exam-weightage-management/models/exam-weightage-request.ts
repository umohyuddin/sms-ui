export interface SubjectWeightageDTO {
    subjectId: number;
    weightPercentage: number;
    active: boolean;
}

export interface BulkExamWeightageRequestDTO {
    academicYearId: number;
    examTermId: number;
    standardId: number;
    weightages: SubjectWeightageDTO[];
}
