export interface FeeRateResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  effectiveFrom: string;   // ISO date string
  effectiveTo: string | null;
  active: boolean;
  campus: Campus;
  standard: Standard;
  feeComponent: FeeComponent;
  academicYear: AcademicYear;
}

export interface Campus {
  id: number;
  campusName: string;
  campusCode: string | null;
  contactNumber: string;
  email: string;
  website: string;
  address: string;
  active: boolean;
}

export interface Standard {
  id: number;
  standardName: string;
  standardCode: string | null;
  description: string | null;
}

export interface FeeComponent {
  id: number;
  componentCode: string;
  componentName: string;
  accountCode: string;
  taxable: boolean;
  feeCatalog: FeeCatalog;   // added FeeCatalog
}

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

export interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  totalMonths: number;
}
