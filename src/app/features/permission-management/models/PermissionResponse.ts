export interface PermissionResponse {
  id: number;
  permissionName: string;
  code?: string | null;
  module?: string | null;
  description?: string | null;
}
