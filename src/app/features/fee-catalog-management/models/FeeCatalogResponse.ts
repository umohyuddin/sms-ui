export interface FeeCatalogResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  chargeType: string;
  chargeTypeLabel:string
  recurrenceRule?: string;
  recurrenceRuleLabel?:string
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string;
}
