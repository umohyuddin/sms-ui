import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SectionResponse } from '../../models/SectionResponse';
import { SectionManagementService } from '../../services/section-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-section-info',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.css']
})
export class SectionInfoComponent {
  sectionData?: SectionResponse;
  sectionId!: string;
  URL = '';
  isLoading: boolean = false;
  loadingMessage: string = '';
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
    this.isLoading = true;
    this.loadingMessage = 'Loading section details...';
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
        this.isLoading = false;
      },
      complete: () => {
        this.logger.complete('Request Complete');
        this.isLoading = false;
      }
    })
  }

  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }
}
