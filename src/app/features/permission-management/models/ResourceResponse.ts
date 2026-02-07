import { ModuleResponse } from './ModuleResponse';

export interface ResourceResponse {
    id: number;
    resourceName: string;
    module?: ModuleResponse | null;
    version?: string | null;
    isActive?: boolean;
    description?: string | null;
    isAuthRequired?: boolean;
    rateLimit?: number;
    isDeprecated?: boolean;
    documentationUrl?: string | null;
    owner?: string | null;
    deleted?: boolean;
}
