export interface ConcessionResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  chargeType: string;
  chargeTypeLabel:string
  recurrenceRule?: string;
  recurrenceRuleLabel?:string
 createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string;

  isActive: boolean;
}
