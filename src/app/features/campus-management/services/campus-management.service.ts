import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class CampusManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getAllCampuses(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CAMPUSES.GET_ALL}`, { observeResponse: true });
  }

    saveCampuse(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;

    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CAMPUSES.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CAMPUSES.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
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
