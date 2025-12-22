export interface DashboardFinancial {
  // Monthly stats
  assignedMonthlyFee: number;
  collectedMonthlyFee: number;
  outstandingMonthlyFee: number;
  collectionPercentageMonthlyFee: number;

  // Yearly stats
  assignedYearlyFee: number;
  collectedYearlyFee: number;
  outstandingYearlyFee: number;
  collectionPercentageYearlyFee: number;
}
