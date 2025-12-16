import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { FeeCatalogResponse } from '../../models/FeeCatalogResponse';
import { FeeCatalogManagementService } from '../../services/fee-catalog-management.service';
import { SmsUtil } from '../../../../core/utils/smsUtil';


@Component({
  selector: 'app-fee-catalog-info',
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './fee-catalog-info.component.html',
  styleUrls: ['./fee-catalog-info.component.css']
})
export class FeeCatalogInfoComponent {
  feeCatalogData?: FeeCatalogResponse;
  routedId!: string;
  constructor(
    private feeCatalogManagementService: FeeCatalogManagementService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('ID from route:', this.routedId);
    this.getFeeCatalogDetails(this.routedId);
  }

  getFeeCatalogDetails(routedId: string): void {
    this.feeCatalogManagementService.getFeeCatalogById(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogData = response.body;
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
