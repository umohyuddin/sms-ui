export interface ConcessionRateResponse {
  id: number;
  value: number;
  isPercentage: boolean;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo: string;   // YYYY-MM-DD
  isActive: boolean;
  
  discountSubType?: {
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    discountType?: {
      id: number;
      code: string;
      name: string;
      chargeType?: { id: number; code: string; name: string };
      recurrenceRule?: { id: number; code: string; name: string };
    };
  };

  campus?: { id: number; campusName: string };
  academicYear?: { id: number; name: string };
}
