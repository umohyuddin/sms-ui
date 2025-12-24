export interface DashboardFinancial {
  // Monthly stats
  assignedMonthlyFee: number;
  collectedMonthlyFee: number;
  outstandingMonthlyFee: number;
  collectionPercentageMonthlyFee: number;
  monthName:string

  // Yearly stats
  assignedYearlyFee: number;
  collectedYearlyFee: number;
  outstandingYearlyFee: number;
  collectionPercentageYearlyFee: number;
  academicYearName:string;
}
