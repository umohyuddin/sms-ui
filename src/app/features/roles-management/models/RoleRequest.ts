export interface RoleRequest {
  organizationId: number;
  code: string;
  name: string;
  description?: string;
  systemRole?: boolean;
  active?: boolean;
  permissionIds?: number[];
}
