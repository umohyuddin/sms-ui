import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { FeeRateInfoComponent } from '../../components/fee-rate-info/fee-rate-info.component';
import { FeeRateManagementService } from '../../services/fee-rate-management.service';
import { FeeRateResponse } from '../../models/FeeRateResponse';



@Component({
  selector: 'app-rate-details',
  imports: [FeeRateInfoComponent
  ],
  templateUrl: './fee-rate-details.html',
  styleUrls: ['./fee-rate-details.css'],
  standalone: true,
})
export class FeeRateDetails {
  feeRateData?: FeeRateResponse;
  feeRateId!: string;
  constructor(private feeRateManagementService: FeeRateManagementService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {
    this.feeRateId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Fee Rate ID from route:', this.feeRateId);
    this.getFeeRateDetails(this.feeRateId);
  }

  getFeeRateDetails(feeRateId: string): void {
    this.feeRateManagementService.getFeeRateById(feeRateId).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);
        this.feeRateData = response.body;
        console.log('standard Details:', this.feeRateData);
      },
      error: (error) => {
        console.error('❌ Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
      }
    });
  }
}


