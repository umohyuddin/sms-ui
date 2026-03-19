import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class AdmissionTypeManagementService {
  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getAllAdmissionTypes(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.GET_ALL}`, { observeResponse: true });
  }

  saveAdmissionType(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  searchAdmissionTypes(query: string): Observable<any> {
    const url = query
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.SEARCH(query)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  getAdmissionTypeById(id: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.GET_BY_ID(id)}`, { observeResponse: true });
  }

  deleteAdmissionType(id: any): Observable<any> {
    return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.DELETE(id)}`, { observeResponse: true });
  }

  getStatistics(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.STATISTICS}`, { observeResponse: true });
  }
}
