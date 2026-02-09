import { Component } from '@angular/core';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { SalaryStructureResponse } from '../../models/SalaryStructureResponse';
import { ActivatedRoute } from '@angular/router';
import { SalaryStructureService } from '../../services/salary-structure.service';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';


@Component({
  selector: 'app-salary-structure-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salary-structure-info.component.html',
  styleUrl: './salary-structure-info.component.css'
})
export class SalaryStructureInfoComponent {

  responseData?: SalaryStructureResponse;
  routedId!: string;
  URL = '';
  constructor(
    private salaryStructureManagementService: SalaryStructureService,
    private route: ActivatedRoute,
   private logger: LoggerService) { }

  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Campus ID from route:', this.routedId);
    this.getSalaryDetails(this.routedId);
  }

  getSalaryDetails(routedId: string): void {
    this.salaryStructureManagementService.getSalaryStructureById(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.responseData = response.body;
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
