import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { ResourceResponse } from '../../models/ResourceResponse';
import { SmsUtil } from '../../../../core/utils/smsUtil';

@Component({
    selector: 'app-resource-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './resource-info.component.html',
    styleUrl: './resource-info.component.css'
})
export class ResourceInfoComponent {
    resourceData?: ResourceResponse;
    resourceId!: string;
    URL = '';

    constructor(
        private httpClientService: HttpClientService,
        private route: ActivatedRoute,
        private appConfig: AppConfigService
    , private logger: LoggerService) { }

    ngOnInit(): void {
        console.log('API Base URL:', this.appConfig.apiBaseUrl);
        this.URL = this.appConfig.apiBaseUrl;

        this.resourceId = this.route.snapshot.paramMap.get('id') ?? '';
        console.log('Resource ID from route:', this.resourceId);
        this.getResourceDetails(this.resourceId);
    }

    getResourceDetails(resourceId: string): void {
        const url = `${this.URL}${API_ENDPOINTS.USERS.RESOURCES.GET_BY_ID(resourceId)}`;
        this.httpClientService
            .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
            .subscribe({
                next: (response) => {
                    console.log('Success Status:', response.status);
                    console.log('📦 Response Body:', response.body);
                    this.resourceData = response.body;
                    console.log('📦 Resource data:', this.resourceData);
                },
                error: (error) => {
                    console.error('❌ Request Error Status:', error.status);
                    console.error('Message:', error.message);
                }
            });
    }

    getInitials(name?: string): string {
        return SmsUtil.getInitials(name ?? '');
    }
}
