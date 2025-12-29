import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDeductionService } from '../../services/employee-deduction.service';
import { EmployeeDeduction } from '../../models/employee-deduction.model';

@Component({
  selector: 'app-employee-deduction-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-deduction-listing.component.html',
  styleUrl: './employee-deduction-listing.component.css'
})
export class EmployeeDeductionListingComponent implements OnInit {
  employeeDeduction: EmployeeDeduction | null = null;
  loading = false;

  constructor(private employeeDeductionService: EmployeeDeductionService) { }

  ngOnInit(): void {
    this.loadEmployeeDeductions();
  }

  loadEmployeeDeductions(): void {
    this.loading = true;
    // Hardcoded employee ID as requested
    this.employeeDeductionService.getEmployeeDeductions(1).subscribe({
      next: (data) => {
        this.employeeDeduction = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employee deductions:', error);
        this.loading = false;
      }
    });
  }
}
