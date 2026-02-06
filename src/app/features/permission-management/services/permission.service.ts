import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { JwtService } from '../../../core/services/jwt.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService,
    private jwtService: JwtService
  ) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getAllPermissions(): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.GET_ALL}?organizationId=${organizationId}`;
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }

  getPermissionById(id: string | number): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.GET_BY_ID(id)}?organizationId=${organizationId}`;
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }

  savePermission(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const organizationId = this.jwtService.getOrganizationId();

    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.UPDATE(id)}?organizationId=${organizationId}`
      : `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  searchPermissions(keyword: string): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.SEARCH(keyword)}&organizationId=${organizationId}`
      : `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.GET_ALL}?organizationId=${organizationId}`;

    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  deletePermission(id: number): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.DELETE(id)}?organizationId=${organizationId}`;
    return this.http.request(
      HTTP_METHOD.DELETE,
      url,
      { observeResponse: true }
    );
  }

  getAllModules(): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.GET_ALL}`;
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }
}
