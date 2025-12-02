import { Component } from '@angular/core';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { AppConfigService } from '../../../../core/services/app-config.service';

import { StandardInfoComponent } from '../../components/standard-info/standard-info.component';
import { StandardResponse } from '../../models/standardResponse';

@Component({
  selector: 'app-standard-details',
  imports: [StandardInfoComponent, LoaderComponent],
  templateUrl: './standard-details.html',
  styleUrls: ['./standard-details.css'],
  standalone: true,
})
export class StandardDetails {
  spinner = true;
  standardData?: StandardResponse;
  standardId!: string;
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

    this.standardId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('standard ID from route:', this.standardId);
    this.getstandardDetails(this.standardId);
  }

  getstandardDetails(standardId: string): void {
    const url = `${this.URL}/${standardId}`;
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('✅ Status:', response.status);
          console.log('📦 Body:', response.body);
          this.standardData = response.body;
          console.log('standard Details:', this.standardData);
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


