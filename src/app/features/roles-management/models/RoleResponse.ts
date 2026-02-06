export interface RoleResponse {
  id: number;
  organizationId?: number;
  code: string;
  name: string;
  description?: string | null;
  systemRole?: boolean;
  active?: boolean;
  deleted?: boolean;
}
