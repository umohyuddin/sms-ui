export interface SubjectGroup {
    id?: number;
    name: string;
    code?: string;
    description?: string;
    isActive: boolean;
}

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
