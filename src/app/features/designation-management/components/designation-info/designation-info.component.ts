import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { DesignationResponse } from '../models/DesignationResponse';
import { DesignationManagementService } from '../../services/designationManagement.service';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-designation-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './designation-info.component.html',
  styleUrl: './designation-info.component.css'
})
export class DesignationInfoComponent {
  responseData?: DesignationResponse;
  routedId!: string;
  URL = '';
  constructor(private httpClientService: DesignationManagementService
    , private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    this.getCampusDetails(this.routedId);
  }

  getCampusDetails(campusId: string): void {
    this.httpClientService.getDesignationById(campusId).subscribe({
        next: (response) => {
          console.log('  Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.responseData = response.body;
          console.log('📦 Campus data :', this.responseData);
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
