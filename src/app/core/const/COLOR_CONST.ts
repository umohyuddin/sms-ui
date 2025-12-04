export const RECURRENCE_RULE_CLASSES: { [key: string]: string } = {
  ONE_TIME: "recurrence-one-time",
  MONTHLY: "recurrence-monthly",
  QUARTERLY: "recurrence-quarterly",
  BI_MONTHLY: "recurrence-bi-monthly",
  HALF_YEARLY: "recurrence-half-yearly",
  YEARLY: "recurrence-yearly",
  TERM_WISE: "recurrence-term-wise",
  SEMESTER_WISE: "recurrence-semester-wise"
};

export const CHARGE_TYPE_CLASSES: { [key: string]: string } = {
  FIXED: "charge-fixed",
  PERCENTAGE: "charge-percentage",
  PER_CREDIT: "charge-per-credit",
  PER_SUBJECT: "charge-per-subject",
  VARIABLE: "charge-variable",
  SLAB_BASED: "charge-slab-based",
  USAGE_BASED: "charge-usage-based",
  DISCOUNTED: "charge-discounted"
};