import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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
  }

  getAllPermissions(): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      return new Observable(observer => observer.error({ message: 'Organization ID not found in token' }));
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.GET_ALL(organizationId)}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(
      map((res: any) => Array.isArray(res.body) ? res.body : res.body?.data || [])
    );
  }

  getPermissionById(id: string | number): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      return new Observable(observer => observer.error({ message: 'Organization ID not found' }));
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.GET_BY_ID(id, organizationId)}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(map((res: any) => res.body.data));
  }

  savePermission(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const organizationId = this.jwtService.getOrganizationId();

    if (!organizationId && !isUpdate) {
      return new Observable(observer => observer.error({ message: 'Organization ID not found' }));
    }

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.UPDATE(id, organizationId!)}`
      : `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.CREATE}`;

    // Ensure organizationId is in payload for create
    if (!isUpdate) {
      payload.organizationId = organizationId;
    }

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    }).pipe(map((res: any) => res.body.data));
  }

  searchPermissions(keyword: string): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      return new Observable(observer => observer.error({ message: 'Organization ID not found' }));
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.SEARCH(organizationId, keyword)}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(
      map((res: any) => Array.isArray(res.body) ? res.body : res.body?.data || [])
    );
  }

  deletePermission(id: number): Observable<any> {
    const organizationId = this.jwtService.getOrganizationId();
    if (!organizationId) {
      return new Observable(observer => observer.error({ message: 'Organization ID not found' }));
    }
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.PERMISSIONS.DELETE(id, organizationId)}`;
    return this.http.request(HTTP_METHOD.DELETE, url, { observeResponse: true });
  }

  // Helper methods to load triplets
  getModules(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(
      map((res: any) => {
        // Handle both wrapped and unwrapped responses
        if (Array.isArray(res.body)) {
          return res.body;
        }
        return res.body?.data || [];
      })
    );
  }

  getResources(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.RESOURCES.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(
      map((res: any) => {
        // Handle both wrapped and unwrapped responses
        if (Array.isArray(res.body)) {
          return res.body;
        }
        return res.body?.data || [];
      })
    );
  }

  getActions(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ACTIONS.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(
      map((res: any) => {
        // Handle both wrapped and unwrapped responses
        if (Array.isArray(res.body)) {
          return res.body;
        }
        return res.body?.data || [];
      })
    );
  }
}
