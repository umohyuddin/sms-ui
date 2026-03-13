import { Component } from '@angular/core';
import { DepartmentResponse } from '../../models/DepartmentResponse';
import { ActivatedRoute } from '@angular/router';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { LoggerService } from '../../../../core/services/logger.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-department-info',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './department-info.component.html',
  styleUrl: './department-info.component.css'
})
export class DepartmentInfoComponent {
  departmentData?: DepartmentResponse;
  departmentId!: string;
  URL = '';
  isLoading: boolean = false;
  loadingMessage: string = '';

  constructor(
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;

    this.departmentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Department ID from route:', this.departmentId);
    this.getDepartmentDetails(this.departmentId);
  }

  getDepartmentDetails(departmentId: string): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading department details...';
    const url = `${this.URL}${API_ENDPOINTS.INSTITUTE.DEPARTMENTS.GET_BY_ID(departmentId)}`;
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
      .subscribe({
        next: (response) => {
          console.log('  Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.departmentData = response.body;
          console.log('📦 Department data :', this.departmentData);
        },
        error: (error) => {
          console.error('❌ Request Error Status:', error.status);
          console.error('Message:', error.message);
          this.isLoading = false;
        },
        complete: () => {
          console.log('🔚 Request Complete');
          this.isLoading = false;
        }
      });
  }

  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }
}