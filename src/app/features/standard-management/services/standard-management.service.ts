import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class StandardManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }


  saveStandard(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;

    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.STANDARDS.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.STANDARDS.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }
  getAllStandards(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.STANDARDS.GET_ALL}`, { observeResponse: true });
  }

  getStandardById(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.STANDARDS.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }
  getStandardsByCampusId(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.STANDARDS.GET_BY_CAMPUS_ID(id)}`,
      { observeResponse: true }
    );
  }

  searchStandards(params: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.STANDARDS.SEARCH}`,
      {
        observeResponse: true,
        params: params
      }
    );
  }

  getSectionsByStandardId(id: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.SECTIONS.GET_BY_STANDARD_ID(id.toString())}`,
      { observeResponse: true }
    );
  }

  deleteCampus(id: number): Observable<any> {
    return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}/${id}`, { observeResponse: true });
  }

}
