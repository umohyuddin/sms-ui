import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { HTTP_METHOD } from '../const/HTTP_METHOD';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AcademicYearResponse } from '../../features/tenant-management/models/AcademicYearResponse';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private config: any = {};
  private academicYearData: AcademicYearResponse | null = null;
  constructor(private httpClientService: HttpClientService,
    private http: HttpClient
  ) { }

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


  loadConfig_(): Promise<void> {
    return firstValueFrom(
      this.httpClientService.request<any>(HTTP_METHOD.GET, '/assets/config/config.json', { observeResponse: true })
    ).then(response => {
      this.config = response.body;

      // Now fetch backend static data using loaded apiBaseUrl
      return firstValueFrom(
        this.http.get<AcademicYearResponse>(`${this.apiBaseUrl}/api/school/academic/current`)
      );
    }).then(data => {
      this.academicYearData = data;
      console.log("Startup data loaded:", data);
    }).catch(err => console.error(err));
  }

  get apiBaseUrl(): string {
    return this.config?.TENANT_SERVICE_BASE_URL || '';
  }
  getAcademicYear(): AcademicYearResponse | null {
    return this.academicYearData;
  }

  get dummyDataEnablement(): boolean {
    return this.config?.ENABLE_DUMMAY_DATA || false;
  }

}
