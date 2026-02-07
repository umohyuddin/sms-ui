export interface PermissionRequest {
  organizationId?: number;
  name: string;
  code: string;
  moduleId?: number | null;
  resourceId?: number | null;
  actionId?: number | null;
  description?: string | null;
  systemPermission?: boolean;
  active?: boolean;
}
