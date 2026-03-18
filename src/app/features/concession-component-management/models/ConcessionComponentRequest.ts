export interface ConcessionComponentRequest {
  code: string;
  name: string;
  description: string;
  discountTypeId: number;
  isActive: boolean;
  priority?: number;
  displayOrder?: number;
}
