export interface PermissionRequest {
  permissionName: string;
  code?: string | null;
  module?: string | null;
  description?: string | null;
}
