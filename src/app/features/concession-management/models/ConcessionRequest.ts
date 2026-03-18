export interface ConcessionRequest {
  code: string;
  name: string;
  description?: string;
  active: boolean;
  chargeTypeId: number;
  recurrenceRuleId?: number;
  priority?: number;
  displayOrder?: number;
}
