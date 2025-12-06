import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FeeCatalogComponentManagementService } from '../../services/fee-catalog-component-management.service';
import { FeeCatalogComponentResponse } from '../../models/FeeCatalogComponentResponse';
import { SmsUtil } from '../../../../core/utils/smsUtil';


@Component({
  selector: 'app-fee-catalog-component-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fee-catalog-component-info.component.html',
  styleUrls: ['./fee-catalog-component-info.component.css']
})
export class FeeCatalogComponentInfoComponent {
  resourceData?: FeeCatalogComponentResponse;
  routedId!: string;
  constructor(
    private feeCatalogComponentManagementService: FeeCatalogComponentManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('ID from route:', this.routedId);
    this.getFeeCatalogComponentDetails(this.routedId);
  }

  getFeeCatalogComponentDetails(routedId: string): void {
    this.feeCatalogComponentManagementService.getFeeCatalogComponentsById(routedId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.resourceData = response.body;
        console.log('📦 Standard data :', this.resourceData);
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
