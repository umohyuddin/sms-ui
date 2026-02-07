export interface ModuleResponse {
    id: number;
    name: string;
    code: string;
    description?: string | null;
    active?: boolean;
    deleted?: boolean;
}
