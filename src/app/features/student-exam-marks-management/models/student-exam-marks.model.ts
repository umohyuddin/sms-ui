export interface StudentMark {
    studentId: number | string;
    studentName?: string;
    rollNumber?: string;
    obtainedMarks: number;
    remarks?: string;
    active: boolean;
}

export interface ExamMarksRequest {
    examId: number | string;
    subjectId: number | string;
    marks: StudentMark[];
}
