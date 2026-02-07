export interface ActionResponse {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    active?: boolean;
    deleted?: boolean;
}
