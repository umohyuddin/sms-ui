import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ConcessionRateManagementService } from '../../services/concession-rate-management.service';
import { ConcessionRateResponse } from '../../models/ConcessionRateResponse';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { LoggerService } from '../../../../core/services/logger.service';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';

@Component({
  selector: 'app-concession-rate-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concession-rate-info.component.html',
  styleUrls: ['./concession-rate-info.component.css']
})
export class ConcessionComponentInfoComponent implements OnInit {
  resourceData?: ConcessionRateResponse;
  routedId!: string;

  constructor(
    private concessionRateManagementService: ConcessionRateManagementService,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.routedId) {
      this.getConcessionRateDetails(this.routedId);
    }
  }

  getConcessionRateDetails(concessionId: string | number): void {
    LoggerUtil.log('ConcessionRateInfo', 'Details', 'Fetching details for ID', concessionId);
    this.concessionRateManagementService.getConcessionRateById(concessionId).subscribe({
      next: (response) => {
        this.resourceData = response.body;
      },
      error: (error) => {
        LoggerUtil.error('ConcessionRateInfo', 'Details', '❌ Failed to load rate details', error);
      }
    });
  }

  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }
}
