export interface InstituteFinancialSettings {
    id?: number;
    instituteId: number;
    academicYearId: number;

    // Currency & Localization
    currencyId: number;
    languageId?: number;
    locale?: string;

    // Fee Structure Rules
    feeRecurrenceRuleId?: number;
    allowPartialPayments?: boolean;
    lateFeeApplicable?: boolean;
    lateFeeType?: string; // FIXED, PERCENTAGE
    lateFeeValue?: number;

    // Tax Rules
    taxApplicable?: boolean;
    taxTypeId?: number;
    taxIncludedInFee?: boolean;

    // Refund Rules
    refundsAllowed?: boolean;
    refundPolicyUrl?: string;
    refundWindowDays?: number;
    refundType?: string; // FIXED, PERCENTAGE
    refundValue?: number;
    maxRefundPercentage?: number;
    maxRefundAmount?: number;

    // Compliance Flags
    invoiceMandatory?: boolean;
    receiptMandatory?: boolean;

    isActive?: boolean;
}
