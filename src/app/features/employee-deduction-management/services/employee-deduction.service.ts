import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EmployeeDeduction } from '../models/employee-deduction.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDeductionService {

  constructor() { }

  getEmployeeDeductions(employeeId: number): Observable<EmployeeDeduction> {
    // Static data for demonstration
    const mockData: EmployeeDeduction = {
      employeeId: 1,
      employeeName: 'John Doe',
      employeeCode: 'EMP001',
      department: 'IT Department',
      designation: 'Software Engineer',
      deductions: [
        {
          id: 1,
          deductionType: 'Provident Fund',
          amount: 1200.00,
          description: 'Monthly PF contribution',
          effectiveDate: '2024-01-01',
          status: 'Active'
        },
        {
          id: 2,
          deductionType: 'Professional Tax',
          amount: 235.00,
          description: 'Monthly professional tax',
          effectiveDate: '2024-01-01',
          status: 'Active'
        },
        {
          id: 3,
          deductionType: 'Loan Repayment',
          amount: 5000.00,
          description: 'Monthly loan installment',
          effectiveDate: '2024-02-01',
          status: 'Active'
        },
        {
          id: 4,
          deductionType: 'Insurance Premium',
          amount: 1500.00,
          description: 'Health insurance premium',
          effectiveDate: '2024-01-01',
          status: 'Active'
        }
      ]
    };

    return of(mockData);
  }
}
