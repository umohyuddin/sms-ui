import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { StandardResponse } from '../../models/standardResponse';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { StandardManagementService } from '../../services/standard-management.service';
import { SmsUtil } from '../../../../core/utils/smsUtil';

@Component({
  selector: 'app-standard-info',
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './standard-info.component.html',
  styleUrls: ['./standard-info.component.css']
})
export class StandardInfoComponent {
  standardData?: StandardResponse;
  standardId!: string;
  URL = '';
  constructor(
    private standardManagementService: StandardManagementService,
    private route: ActivatedRoute
  , private logger: LoggerService) { }

  ngOnInit(): void {
    this.standardId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Campus ID from route:', this.standardId);
    this.getStandardDetails(this.standardId);
  }

  getStandardDetails(standardId: string): void {
    this.standardManagementService.getStandardById(standardId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.standardData = response.body;
        console.log('📦 Standard data :', this.standardData);
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
