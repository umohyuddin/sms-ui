import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SectionResponse } from '../../models/SectionResponse';
import { SectionManagementService } from '../../services/section-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { SmsUtil } from '../../../../core/utils/smsUtil';

@Component({
  selector: 'app-section-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.css']
})
export class SectionInfoComponent {
  sectionData?: SectionResponse;
  sectionId!: string;
  URL = '';
  constructor(
    private sectionManagementService: SectionManagementService,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    this.sectionId = this.route.snapshot.paramMap.get('id') ?? '';
    this.logger.info('Section ID from route', this.sectionId);
    this.getSectionDetails(this.sectionId);
  }

  getSectionDetails(sectionId: string): void {
    this.sectionManagementService.getSectionById(sectionId).subscribe({
      next: (response) => {
        this.logger.success('Success Status', response.status);
        this.logger.info('Response Body', response.body);
        this.sectionData = response.body;
        this.logger.info('Standard data', this.sectionData);
      },
      error: (error) => {
        this.logger.error('Request Error Status', error.status);
        this.logger.error('Message', error.message);
      },
      complete: () => {
        this.logger.complete('Request Complete');
      }
    })
  }

  getInitials(name?: string): string {
      return SmsUtil.getInitials(name ?? '');
    }
}
