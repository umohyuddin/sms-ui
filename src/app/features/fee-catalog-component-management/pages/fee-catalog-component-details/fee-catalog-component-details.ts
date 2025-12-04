import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { FeeCatalogComponentInfoComponent } from '../../components/fee-catalog-component-info/fee-catalog-component-info.component';
import { FeeCatalogComponentManagementService } from '../../services/fee-catalog-component-management.service';



@Component({
  selector: 'app-fee-catalog-component-details',
  imports: [FeeCatalogComponentInfoComponent
  ],
  templateUrl: './fee-catalog-component-details.html',
  styleUrls: ['./fee-catalog-component-details.css'],
  standalone: true,
})
export class FeeCatalogComponentDetails {
  sectionData?: StandardResponse;
  feeCatalogComponentId!: string;
  constructor(private feeCatalogComponentManagementService: FeeCatalogComponentManagementService
    , private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {
    this.feeCatalogComponentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Fee Catalog Component ID from route:', this.feeCatalogComponentId);
    this.getSectionDetails(this.feeCatalogComponentId);
  }

  getSectionDetails(sectionId: string): void {
    this.feeCatalogComponentManagementService.getFeeCatalogComponentsById(sectionId).subscribe({
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


