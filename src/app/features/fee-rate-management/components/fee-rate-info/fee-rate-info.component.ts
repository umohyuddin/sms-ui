import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { FeeRateManagementService } from '../../services/fee-rate-management.service';
import { FeeRateResponse } from '../../models/FeeRateResponse';



@Component({
  selector: 'app-fee-rate-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fee-rate-info.component.html',
  styleUrls: ['./fee-rate-info.component.css']
})
export class FeeRateInfoComponent {
  resourceData?: FeeRateResponse;
  routedId!: string;

  constructor(
    private feeRateManagementService: FeeRateManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Section ID from route:', this.routedId);
    this.getFeeRateDetails(this.routedId);
  }

  getFeeRateDetails(routedId: string): void {
    this.feeRateManagementService.getFeeRateById(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.resourceData = response.body;
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
