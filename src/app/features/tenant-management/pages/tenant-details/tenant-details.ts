import { Component } from '@angular/core';
import { TenantInfoComponent } from '../../components/tenant-info/tenant-info.component';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';
import { Tenant } from '../../models/tenant';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { AppConfigService } from '../../../../core/services/app-config.service';
@Component({
  selector: 'app-tenant-details',
  imports: [TenantInfoComponent, LoaderComponent],
  templateUrl: './tenant-details.html',
  styleUrls: ['./tenant-details.css'],
  standalone: true,
})
export class TenantDetails {
  spinner = true;
  tenantData?: Tenant;
  tenantId!: string;
  isActive = true;
  URL = '';
  toggleStatus() {

    this.isActive = !this.isActive;
  }
  constructor(private httpClientService: HttpClientService
    , private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;

    this.tenantId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Tenant ID from route:', this.tenantId);
    this.getTenantDetails(this.tenantId);
  }

  getTenantDetails(tenantId: string): void {
    const url = `${this.URL}/${tenantId}`;
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('✅ Status:', response.status);
          console.log('📦 Body:', response.body);
          this.tenantData = response.body;
          console.log('Tenant Details:', this.tenantData);
        },
        error: (error) => {
          this.spinner = false;
          console.error('❌ Error Status:', error.status);
          console.error('Message:', error.message);
        },
        complete: () => {
          this.spinner = false;
        }
      });
  }
}


