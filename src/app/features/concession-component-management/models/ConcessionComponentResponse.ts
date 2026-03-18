export interface ConcessionComponentResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  priority?: number;
  displayOrder?: number;
  discountType?: {
    id: number;
    code: string;
    name: string;
    chargeType?: { id: number; code: string; name: string };
    recurrenceRule?: { id: number; code: string; name: string };
  };
}
