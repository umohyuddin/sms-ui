export interface SubjectGroup {
    id?: number;
    name: string;
    code?: string;
    description?: string;
    active: boolean;
}

export interface Subject {
    id?: number;
    name: string;
    code: string;
    description?: string;
    subjectGroupId: number;
    subjectGroupName?: string;
    core: boolean;
    active: boolean;
}
