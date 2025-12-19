import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getAcademicYears(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_ALL}`, { observeResponse: true });
  }

  getCurrentAcademicYear(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_CURRENT}`, { observeResponse: true });
  }

  getAcademicYearId(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }

  createAcademicYear(payload: any): Observable<any> {
    return this.http.request(
      HTTP_METHOD.POST,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.CREATE}`,
      {
        observeResponse: true,
        body: payload
      }
    );
  }
  searchAcademicYears(params: { keyword?: string }): Observable<any> {
    const query = params.keyword ? `?keyword=${encodeURIComponent(params.keyword)}` : '';
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.SEARCH}${query}`;
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }

}
