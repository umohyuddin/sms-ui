import { Component } from '@angular/core';
import { EmployeeSalaryFullResponse } from '../../models/EmployeeSalary';
import { EmployeeSalaryService } from '../../services/employee-salary.service';
import { ActivatedRoute } from '@angular/router';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-salary-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-salary-info.component.html',
  styleUrl: './employee-salary-info.component.css'
})
export class EmployeeSalaryInfoComponent {
employeeSalaryData?: EmployeeSalaryFullResponse;
  routedId!: string;

  constructor(
    private employeeSalaryManagementService: EmployeeSalaryService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Employee ID from route:', this.routedId);
    this.getEmployeeSalaryDetails(this.routedId);
  }

  getEmployeeSalaryDetails(routedId: string): void {
    this.employeeSalaryManagementService.getEmployeeSalaryById(routedId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.employeeSalaryData = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }

  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }

}
