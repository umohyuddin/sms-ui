import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService
  ) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getAllRoles(): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.GET_ALL}`,
      { observeResponse: true }
    );
  }

  getRoleById(id: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }

  getRolesByOrganizationId(organizationId: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.GET_BY_ORGANIZATION(organizationId)}`,
      { observeResponse: true }
    );
  }

  saveRole(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  searchRoles(keyword: string): Observable<any> {
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.SEARCH(keyword)}`
      : `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.GET_ALL}`;

    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  deleteRole(id: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.DELETE,
      `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.DELETE(id)}`,
      { observeResponse: true }
    );
  }
}
