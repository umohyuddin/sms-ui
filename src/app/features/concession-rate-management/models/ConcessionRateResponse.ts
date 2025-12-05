export interface ConcessionRateResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: DiscountType;
  isActive: boolean;
}

export interface DiscountType {
  id: number;
  name: string;
}
