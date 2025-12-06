import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { CampusResponse } from '../../models/campusResponse';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { SmsUtil } from '../../../../core/utils/smsUtil';


@Component({
  selector: 'app-campus-info',
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './Campus-info.component.html',
  styleUrls: ['./Campus-info.component.css']
})
export class CampusInfoComponent {
  campusData?: CampusResponse;
  CampusId!: string;
  URL = '';
  constructor(private httpClientService: HttpClientService
    , private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;

    this.CampusId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Campus ID from route:', this.CampusId);
    this.getCampusDetails(this.CampusId);
  }

  getCampusDetails(campusId: string): void {
    const url = `${this.URL}${API_ENDPOINTS.INSTITUTE.CAMPUSES.GET_BY_ID(campusId)}`;
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
      .subscribe({
        next: (response) => {
          console.log('✅ Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.campusData = response.body;
          console.log('📦 Campus data :', this.campusData);
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
