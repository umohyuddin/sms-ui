import { Component } from '@angular/core';
import { TenantInfoComponent } from '../../components/tenant-info/tenant-info.component';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';
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

  tenantId!: string;
  isActive = true;
  URL = '';

  constructor(
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;
  }
}


