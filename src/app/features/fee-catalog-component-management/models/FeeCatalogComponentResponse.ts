// fee-catalog.model.ts
export interface FeeCatalog {
  id: number;
  code: string;
  name: string;
  description: string;
  active: boolean;
  chargeType: string;
  chargeTypeLabel: string | null;
  recurrenceRule: string;
  recurrenceRuleLabel: string | null;
}


export interface FeeCatalogComponentResponse {
  id: number;
  feeCatalogId: number;
  active: boolean;
  componentCode: string;
  componentName: string;
  accountCode: string;
  discountable: boolean;
  taxable: boolean;
  description: string;
  feeCatalog: FeeCatalog;
}
