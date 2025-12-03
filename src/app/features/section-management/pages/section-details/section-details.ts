import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { SectionManagementService } from '../../services/section-management.service';


@Component({
  selector: 'app-section-details',
  imports: [],
  templateUrl: './section-details.html',
  styleUrls: ['./section-details.css'],
  standalone: true,
})
export class SectionDetails {
  sectionData?: StandardResponse;
  sectionId!: string;
  isActive = true;
  URL = '';
  toggleStatus() {

    this.isActive = !this.isActive;
  }
  constructor(private sectionManagementService: SectionManagementService
    , private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;

    this.sectionId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('standard ID from route:', this.sectionId);
    this.getSectionDetails(this.sectionId);
  }

  getSectionDetails(sectionId: string): void {
    this.sectionManagementService.getSectionById(sectionId).subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('✅ Status:', response.status);
          console.log('📦 Body:', response.body);
          this.sectionData = response.body;
          console.log('standard Details:', this.sectionData);
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


