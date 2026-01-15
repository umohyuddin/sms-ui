import { Component } from '@angular/core';
import { AssignSalariesComponent } from '../../components/assign-salaries/assign-salaries.component';
import { SalaryStructureService } from '../../../salary-structure-management/services/salary-structure.service';
import { SalaryStructureResponse } from '../../../salary-structure-management/models/SalaryStructureResponse';
import { ActivatedRoute } from '@angular/router';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { CommonModule } from '@angular/common';
import { SalaryStructureDetails } from '../../../salary-structure-component-management/models/SalaryStructureDetails';

@Component({
  selector: 'app-employee-assign-salary',
  standalone: true,
  imports: [
    CommonModule ,AssignSalariesComponent],
  templateUrl: './employee-assign-salary.component.html',
  styleUrl: './employee-assign-salary.component.css'
})
export class EmployeeAssignSalaryComponent {
salaryStructureResponse?: SalaryStructureDetails;
  routedId!: string;
  constructor(
    private salaryStructureService: SalaryStructureService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
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

}
