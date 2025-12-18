export interface FeeConfig {
  recurrenceRules: RecurrenceRules;
  chargeTypes: ChargeTypes;
}

export interface RecurrenceRules {
  ONE_TIME: string;
  MONTHLY: string;
  QUARTERLY: string;
  BI_MONTHLY: string;
  HALF_YEARLY: string;
  YEARLY: string;
  TERM_WISE: string;
  SEMESTER_WISE: string;
}

export interface ChargeTypes {
  FIXED: string;
  PERCENTAGE: string;
  PER_CREDIT: string;
  PER_SUBJECT: string;
  VARIABLE: string;
  SLAB_BASED: string;
  USAGE_BASED: string;
  DISCOUNTED: string;
}


