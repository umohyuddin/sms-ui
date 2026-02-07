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
export class RolesService {
  private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService,
    private jwtService: JwtService
  ) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getAllRoles(): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    console.log('🔍 getAllRoles - organizationId from JWT:', organizationId);
    const decodedToken = this.jwtService.getDecodedToken();
    console.log('🔍 getAllRoles - Full decoded token:', decodedToken);

    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.GET_ALL(organizationId)}`;
    console.log('📍 API URL:', url);
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }

  getRoleById(id: string | number): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.GET_BY_ID(id, organizationId)}`;
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }

  getRolesByOrganizationId(organizationId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.GET_ALL(organizationId)}`;
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }

  saveRole(id: string | null, payload: any): Observable<any> {
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
      ? `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.UPDATE(id, organizationId)}`
      : `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  searchRoles(keyword: string): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.SEARCH(organizationId, keyword)}`
      : `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.GET_ALL(organizationId)}`;

    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  deleteRole(id: number): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      console.error('❌ organizationId is null or undefined in JWT token');
      return new Observable(observer => {
        observer.error({ message: 'Organization ID not found in token' });
      });
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ROLES.DELETE(id, organizationId)}`;
    return this.http.request(
      HTTP_METHOD.DELETE,
      url,
      { observeResponse: true }
    );
  }

  assignRolesToUser(userId: number, roleIds: number[]): Observable<any> {
    const url = `${this.baseUrl}/api/v1/users/${userId}/roles`;
    return this.http.request(HTTP_METHOD.PUT, url, {
      body: roleIds,
      observeResponse: true
    });
  }
}
