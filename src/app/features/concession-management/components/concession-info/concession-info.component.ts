import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { ConcessionManagementService } from '../../services/concession-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';


@Component({
  selector: 'app-concession-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concession-info.component.html',
  styleUrls: ['./concession-info.component.css']
})
export class ConcessionInfoComponent {
  concessionData?: CampusResponse;
  ConcessionId!: string;
  URL = '';
  constructor(
    private concessionManagementService: ConcessionManagementService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {
    
    this.ConcessionId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Campus ID from route:', this.ConcessionId);
    this.getConcessionDetails(this.ConcessionId);
  }

  getConcessionDetails(concessionId: string): void {
   this.concessionManagementService.getConcessionById(concessionId).subscribe({
        next: (response) => {
          console.log('✅ Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.concessionData = response.body;
          console.log('📦 Campus data :', this.concessionData);
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
