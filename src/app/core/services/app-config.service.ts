import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { HTTP_METHOD } from '../const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private config: any = {};
  constructor(private httpClientService: HttpClientService) { }

  loadConfig(): void {

    this.httpClientService.request<any>(HTTP_METHOD.GET, '/assets/config/config.json', { observeResponse: true }).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);
        this.config = response.body
      },
      error: (error) => {
        console.error('❌ Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Delete Complete');
      }
    });
  }

  get apiBaseUrl(): string {
    return this.config?.TENANT_SERVICE_BASE_URL || '';
  }
  get redisPassword(): string {
    return this.config?.redisPassword || '';
  }
  get mongoPassword(): string {
    return this.config?.mongoPassword || '';
  }

    get dummyDataEnablement(): boolean {
    return this.config?.ENABLE_DUMMAY_DATA || false;
  }

  //   getRootDomain(tenantId: string): string {
  //   if (!tenantId) return this.config?.ROOT_DOMAIN || '';
  //   return `${tenantId}.${this.config?.ROOT_DOMAIN}`; 
  // }

  getRootDomain(tenantId: string): string {
    let rootDomain = this.config?.ROOT_DOMAIN || '';

    // If the rootDomain is valid, we work with it as a URL
    try {
      if (!rootDomain.startsWith('http://') && !rootDomain.startsWith('https://')) {
        rootDomain = `https://${rootDomain}`;
      }
      const url = new URL(rootDomain); // Convert to URL object

      // Modify the hostname by prepending the tenantId
      url.hostname = `${tenantId}.${url.hostname}`;

      return url.toString(); // Convert back to string with the updated hostname
    } catch (e) {
      console.error('Invalid ROOT_DOMAIN:', rootDomain);
      return ''; // Return an empty string if ROOT_DOMAIN is invalid
    }
  }

  private resolvePlaceholders(value: string, tenantId?: string): string {
    if (!value || !tenantId) return value;
    return value.replace(/{tenantId}/g, tenantId);
  }

  getCampaignsUrl(tenantId?: string): string {
    const campaignUrl = this.config?.campaigns_url || '';
    return this.resolvePlaceholders(campaignUrl, tenantId);
  }
}
