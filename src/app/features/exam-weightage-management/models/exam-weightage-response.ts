export interface ExamWeightageResponse {
    id: number;
    academicYearId: number;
    academicYearName: string;
    standardSubjectId: number;
    standardName: string;
    subjectName: string;
    examTermId: number;
    examTermName: string;
    weightPercentage: number;
    active: boolean;
}
