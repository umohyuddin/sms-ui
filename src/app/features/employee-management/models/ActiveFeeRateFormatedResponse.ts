export interface ActiveFeeRateResponse {
  id: number;
  name?: string; // now optional
  components: FeeComponent[];

}

export interface FeeComponent {
  id: number;
  name?: string; // now optional
  rates: Rate[];
  chargeType: string;
  recurrenceRule: string;
  discountable: boolean;
  randomClass?: string;
}

export interface Rate {
  id: number;
  code?: string | null;
  name?: string | null;
  description: string;
  amount: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  active: boolean;
  campus: Campus;
  standard: Standard;
  feeComponent: FeeComponentInfo;
  academicYear: AcademicYear;
}

export interface Campus {
  id: number;
  campusName: string;
  campusCode?: string | null;
  contactNumber: string;
  email: string;
  website: string;
  address: string;
  active: boolean;
}

export interface Standard {
  id: number;
  standardName: string;
  standardCode?: string | null;
  description?: string | null;
}

export interface FeeComponentInfo {
  id: number;
  componentCode?: string | null; // optional
  componentName?: string | null; // optional
  accountCode?: string | null;   // optional
  taxable: boolean;
  feeCatalog: FeeCatalog;
}

export interface FeeCatalog {
  id: number;
  code?: string | null; // optional
  name?: string | null; // optional
  description?: string | null; // optional
  active: boolean;
  chargeType: string;
  chargeTypeLabel?: string | null;
  recurrenceRule: string;
  recurrenceRuleLabel?: string | null;
}

export interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  totalMonths: number;
}
