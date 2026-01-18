export interface SalaryPayment {
  id?: number; // Optional for new payments
  employeeId: number;
  employeeName?: string; // Optional, can be mapped from backend if sent
  paymentDate: string; // ISO date string
  paymentMode: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE'; // Add other modes if needed
  transactionReference?: string;
  amountPaid: number;
  remarks?: string;
  createdAt?: string; // Optional, from backend
  updatedAt?: string; // Optional, from backend
}
