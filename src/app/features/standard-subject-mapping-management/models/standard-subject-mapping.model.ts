export interface Subject {
    id?: number;
    name: string;
    code: string;
    description?: string;
    subjectGroupId: number;
    subjectGroupName?: string;
    isElective: boolean;
    isActive: boolean;
}

export interface StandardSubject {
    id?: number;
    standardId: number;
    subjectId: number;
    academicYearId: number;
    subjectName?: string;
    isMandatory: boolean;
    optional: boolean;
    weeklyHours: number;
    theoryMarks: number;
    practicalMarks: number;
    active: boolean;
}

export interface StandardSubjectRequest {
    standardId: number;
    subjectId: number;
    academicYearId: number;
    optional: boolean;
    weeklyHours?: number;
    theoryMarks?: number;
    practicalMarks?: number;
    active: boolean;
}

export interface Standard {
    id: number;
    standardName: string;
    standardCode: string;
}

export interface Campus {
    id: number;
    campusName: string;
    campusCode: string;
}

export interface AcademicYear {
    id: number;
    name: string;
    isActive: boolean;
    isCurrent: boolean;
}
