export interface ModuleResponse {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  route?: string | null;
  displayOrder?: number;
  systemModule?: boolean;
  active?: boolean;
  deleted?: boolean;
  createdAt?: string | null;
  createdBy?: number | null;
  updatedAt?: string | null;
  updatedBy?: number | null;
}
