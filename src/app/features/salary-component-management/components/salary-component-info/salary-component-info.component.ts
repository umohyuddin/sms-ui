import { Component } from '@angular/core';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { SalaryComponentResponse } from '../../models/SalaryComponent';
import { SalaryComponentService } from '../../services/salary-component.service';
import { ActivatedRoute } from '@angular/router';
import { CHARGE_TYPE_CLASSES } from '../../../../core/const/COLOR_CONST';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salary-component-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salary-component-info.component.html',
  styleUrl: './salary-component-info.component.css'
})
export class SalaryComponentInfoComponent {
   resourceData?: SalaryComponentResponse;
    routedId!: string;
    CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
    constructor(
      private salaryComponentManagementService: SalaryComponentService,
      private route: ActivatedRoute,
    ) { }
  
    ngOnInit(): void {
  
      this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
      console.log('Salary Component ID from route:', this.routedId);
      this.getSalaryComponentDetails(this.routedId);
    }
  
    getSalaryComponentDetails(routedId: string): void {
      this.salaryComponentManagementService.getSalaryComponentById(routedId).subscribe({
        next: (response) => {
          console.log('  Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.resourceData = response.body;
          console.log('📦 Campus data :', this.resourceData);
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
getChargeTypeFromPercentage(item?: SalaryComponentResponse): string {
  if (item?.isPercentage === true) {
    return 'PERCENTAGE';
  }
  if (item?.isPercentage === false) {
    return 'FIXED';
  }
  return 'NONE';
}

getChargeTypeLabel(item?: SalaryComponentResponse): string {
  if (item?.isPercentage === true) {
    return 'Percentage';
  }
  if (item?.isPercentage === false) {
    return 'Fixed';
  }
  return 'N/A';
}

}
