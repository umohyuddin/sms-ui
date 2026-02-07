export interface ResourceRequest {
    resourceName: string;
    moduleId?: number | null;
    version?: string | null;
    description?: string | null;
    isAuthRequired?: boolean;
}
