export interface ModuleResponse {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  route?: string | null;
  displayOrder?: number | null;
  systemModule?: boolean;
  active?: boolean;
  deleted?: boolean;
}
