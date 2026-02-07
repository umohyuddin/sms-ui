import { ModuleResponse } from './ModuleResponse';
import { ResourceResponse } from './ResourceResponse';
import { ActionResponse } from './ActionResponse';

export interface PermissionResponse {
  id: number;
  organizationId?: number;
  name: string;
  code: string;
  module?: ModuleResponse | null;
  resource?: ResourceResponse | null;
  action?: ActionResponse | null;
  description?: string | null;
  systemPermission?: boolean;
  active?: boolean;
  deleted?: boolean;
  createdAt?: string | null;
  createdBy?: number | null;
  updatedAt?: string | null;
  updatedBy?: number | null;
}
