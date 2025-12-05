import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { ConcessionRateManagementService } from '../../services/concession-rate-management.service';
import { ConcessionRateResponse } from '../../models/ConcessionRateResponse';


@Component({
  selector: 'app-concession-rate-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concession-rate-info.component.html',
  styleUrls: ['./concession-rate-info.component.css']
})
export class ConcessionComponentInfoComponent {
  resourceData?: ConcessionRateResponse;
  routedId!: string;
  URL = '';
  constructor(
    private concessionRateManagementService: ConcessionRateManagementService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Campus ID from route:', this.routedId);
    this.getConcessionRateDetails(this.routedId);
  }
  getConcessionRateDetails(concessionId: string): void {
    this.concessionRateManagementService.getConcessionRateById(concessionId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
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
}
