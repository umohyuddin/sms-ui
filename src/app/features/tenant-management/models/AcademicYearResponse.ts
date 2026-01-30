export interface AcademicYearResponse {
    id?: number;
    name: string;
    code?: string;
    startDate: string;
    endDate: string;
    totalMonths: number;
    isCurrent: boolean;
    status?: string;
    remarks?: string;
    isLocked?: boolean;
    createdAt?: string;
    updatedAt?: string;
    lockedAt?: string | null;
}