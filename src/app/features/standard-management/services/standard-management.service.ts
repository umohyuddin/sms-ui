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

  searchStandards(params: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.STANDARDS.SEARCH}`,
      {
        observeResponse: true,
        params: params
      }
    );
  }

  searchCampuses(query: string): Observable<any> {
    const url = query
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CAMPUSES.SEARCH(query)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CAMPUSES.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  deleteCampus(id: number): Observable<any> {
    return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}/${id}`, { observeResponse: true });
  }

}
