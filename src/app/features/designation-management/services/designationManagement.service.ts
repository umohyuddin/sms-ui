import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { AppConfigService } from '../../../core/services/app-config.service';
import { HttpClientService } from '../../../core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationManagementService {

 private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  /** Get all designations */
  getAllDesignations(): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DESIGNATIONS.GET_ALL}`,
      { observeResponse: true }
    );
  }

  /** Get designation by ID */
  getDesignationById(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DESIGNATIONS.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }

  /** Create or update designation */
  saveDesignation(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DESIGNATIONS.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DESIGNATIONS.CREATE}`;
    return this.http.request(method, url, { observeResponse: true, body: payload });
  }

  /** Search designations by keyword */
  searchDesignations(query: string): Observable<any> {
    const url = query
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DESIGNATIONS.SEARCH(query)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DESIGNATIONS.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }
}
