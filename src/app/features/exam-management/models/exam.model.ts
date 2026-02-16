export enum ExamStatus {
    DRAFT = 'DRAFT',
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    LOCKED = 'LOCKED',
    PUBLISHED = 'PUBLISHED'
}

export interface ExamRequestDTO {
    id?: number;
    name: string;
    academicYearId: number;
    examTermId: number;
    campusId: number;
    standardId: number;
    sectionId: number;
    startDate: string;
    endDate: string;
    status: ExamStatus;
    organizationId?: number;
}

export interface Exam {
    id: number;
    name: string;
    academicYearId: number;
    academicYearName?: string;
    examTermId: number;
    examTermName?: string;
    campusId: number;
    campusName?: string;
    standardId: number;
    standardName?: string;
    sectionId: number;
    sectionName?: string;
    startDate: string;
    endDate: string;
    status: ExamStatus;
    isActive: boolean;
}
