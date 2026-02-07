export interface ActionRequest {
    code: string;
    name: string;
    description?: string | null;
    active?: boolean;
}
