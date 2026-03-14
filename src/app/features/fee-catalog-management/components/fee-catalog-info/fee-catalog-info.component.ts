import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { FeeCatalogResponse } from '../../models/FeeCatalogResponse';
import { FeeCatalogManagementService } from '../../services/fee-catalog-management.service';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';


@Component({
  selector: 'app-fee-catalog-info',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, LoaderComponent],
  templateUrl: './fee-catalog-info.component.html',
  styleUrls: ['./fee-catalog-info.component.css']
})
export class FeeCatalogInfoComponent implements OnInit {
  isLoading = false;
  loadingMessage = '';
  feeCatalogData?: FeeCatalogResponse;
  routedId!: string;

  constructor(
    private feeCatalogManagementService: FeeCatalogManagementService,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('ID from route:', this.routedId);
    this.getFeeCatalogDetails(this.routedId);
  }

  getFeeCatalogDetails(routedId: string): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading Fee Catalog Details...';
    this.feeCatalogManagementService.getFeeCatalogById(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogData = response.body;
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.log('🔚 Request Complete');
      }
    })
  }

  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }
}
