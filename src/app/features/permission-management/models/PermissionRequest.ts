export interface PermissionRequest {
  organizationId?: number;
  name: string;
  code: string;
  module?: string | null;
  description?: string | null;
  systemPermission?: boolean;
  active?: boolean;
}
