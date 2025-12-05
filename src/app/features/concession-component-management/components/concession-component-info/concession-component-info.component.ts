import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { ConcessionComponentManagementService } from '../../services/concession-component-management.service';
import { ConcessionComponentResponse } from '../../models/ConcessionComponentResponse';


@Component({
  selector: 'app-concession-component-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concession-component-info.component.html',
  styleUrls: ['./concession-component-info.component.css']
})
export class ConcessionComponentInfoComponent {
  concessionComponentData?: ConcessionComponentResponse;
  ConcessionComponentId!: string;
  URL = '';
  constructor(
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {

    this.ConcessionComponentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Campus ID from route:', this.ConcessionComponentId);
    this.getConcessionDetails(this.ConcessionComponentId);
  }

  getConcessionDetails(concessionId: string): void {
    this.concessionComponentManagementService.getConcessionComponentById(concessionId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.concessionComponentData = response.body;
        console.log('📦 Campus data :', this.concessionComponentData);
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
