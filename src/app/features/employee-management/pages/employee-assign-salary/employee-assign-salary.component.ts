import { Component } from '@angular/core';
import { AssignSalariesComponent } from '../../components/assign-salaries/assign-salaries.component';
import { SalaryStructureService } from '../../../salary-structure-management/services/salary-structure.service';
import { SalaryStructureResponse } from '../../../salary-structure-management/models/SalaryStructureResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';
import { SalaryStructureDetails } from '../../../salary-structure-component-management/models/SalaryStructureDetails';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { EmployeeManagementService } from '../../services/employee-management.service';

@Component({
  selector: 'app-employee-assign-salary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-assign-salary.component.html',
  styleUrl: './employee-assign-salary.component.css'
})
export class EmployeeAssignSalaryComponent {
  salaryStructureResponse?: SalaryStructureDetails;
  routedId!: string;
  employeeId!: string;
  constructor(
    private router: Router,
    private salaryStructureService: SalaryStructureService,
    private employeeManagementService: EmployeeManagementService,
    private route: ActivatedRoute,

   private logger: LoggerService) { }

  ngOnInit(): void {

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    this.employeeId = this.route.snapshot.queryParamMap.get('employeeId') ?? '';
    console.log('ID from route:', this.routedId);
    this.getSalaryStructureDetails(this.routedId);
  }

  getSalaryStructureDetails(routedId: string): void {
    this.salaryStructureService.getSalaryStructureByEmployeeType(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.salaryStructureResponse = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    })
  }
  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }


  cancel(): void {
    this.router.navigate(ROUTES.EMPLOYEE.LIST); // adjust route if needed
  }


  applySalary(structure: SalaryStructureDetails): void {
    if (!structure) {
      return;
    }

    const payload = {
      employeeId: Number(this.employeeId),
      salaryStructureId: structure.id,
      grossSalary: structure.totalWithoutDeduction,
      totalDeductions: structure.totalDeductions,
      netSalary: structure.netSalary,
      effectiveDate: structure.effectiveFrom, // must match backend DTO
      status: 'Pending' // or 'PAID' | 'FORWARD'
    };

    console.log('📤 Apply Salary Payload:', payload);
    this.employeeManagementService.createEmployeeSalary(payload).subscribe({
      next: (response) => {
        console.log('✅ Salary applied response:', response);
        this.router.navigate(ROUTES.EMPLOYEE.LIST);
      },
      error: (error) => {
        console.error('❌ Failed to apply salary', error);
        alert(error?.error?.message || 'Failed to apply salary. Please try again.');
      }
    });
  }

}
