export interface ConcessionResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  priority?: number;
  displayOrder?: number;
  chargeType?: { id: number; code: string; name: string };
  recurrenceRule?: { id: number; code: string; name: string };
}
