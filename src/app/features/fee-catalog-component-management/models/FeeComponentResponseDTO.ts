export interface ChargeTypeResponseDTO {
  id: number;
  code: string;
  name: string;
}

export interface FeeRecurrenceRuleResponseDTO {
  id: number;
  code: string;
  name: string;
}

export interface InstituteResponseDTO {
  id: number;
  name: string;
}

export interface FeeCatalogDTO {
  id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  chargeType?: ChargeTypeResponseDTO;
  recurrenceRule?: FeeRecurrenceRuleResponseDTO;
  institute?: InstituteResponseDTO;
}

export interface FeeComponentResponseDTO {
  id: number;
  feeCatalogId?: number;
  componentCode: string;
  componentName: string;
  accountCode?: string;
  taxable?: boolean;
  active: boolean;
  discountable?: boolean;
  feeCatalog?: FeeCatalogDTO;

  // Related FeeCatalog properties (optional if included)
  chargeType?: ChargeTypeResponseDTO;
  recurrenceRule?: FeeRecurrenceRuleResponseDTO;
  institute?: InstituteResponseDTO;
}