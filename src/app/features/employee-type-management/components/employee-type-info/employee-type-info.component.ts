import { Component } from '@angular/core';
import { EmployeeTypeResponse } from '../../models/EmployeeTypeResponse';
import { EmployeeTypeService } from '../../services/employee-type.service';
import { ActivatedRoute } from '@angular/router';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-employee-type-info',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './employee-type-info.component.html',
  styleUrl: './employee-type-info.component.css'
})
export class EmployeeTypeInfoComponent {
 response?: EmployeeTypeResponse;
  routedId!: string;
  constructor(
    private employeeTypeManagementService: EmployeeTypeService,
    private route: ActivatedRoute,

   private logger: LoggerService) { }

  ngOnInit(): void {

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('ID from route:', this.routedId);
    this.getFeeCatalogDetails(this.routedId);
  }

  getFeeCatalogDetails(routedId: string): void {
    this.employeeTypeManagementService.getEmployeeTypeId(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.response = response.body;
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