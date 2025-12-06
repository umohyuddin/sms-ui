import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SectionResponse } from '../../models/SectionResponse';
import { SectionManagementService } from '../../services/section-management.service';
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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.sectionId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Section ID from route:', this.sectionId);
    this.getSectionDetails(this.sectionId);
  }

  getSectionDetails(sectionId: string): void {
    this.sectionManagementService.getSectionById(sectionId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.sectionData = response.body;
        console.log('📦 Standard data :', this.sectionData);
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
