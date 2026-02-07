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
export class RolePermissionService {
    private baseUrl = '';

    constructor(
        private http: HttpClientService,
        private appConfig: AppConfigService,
        private jwtService: JwtService
    ) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

    assignPermissions(payload: { roleId: number, permissionIds: number[] }): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ROLE_PERMISSIONS.ASSIGN}`;
        return this.http.request(HTTP_METHOD.POST, url, {
            body: payload,
            observeResponse: true
        });
    }

    getRolePermissions(roleId: number | string): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ROLE_PERMISSIONS.GET_BY_ROLE(roleId)}`;
        return this.http.request(HTTP_METHOD.GET, url, {
            observeResponse: true
        });
    }

    removePermission(roleId: number | string, permissionId: number | string): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ROLE_PERMISSIONS.REMOVE(roleId, permissionId)}`;
        return this.http.request(HTTP_METHOD.DELETE, url, {
            observeResponse: true
        });
    }

    removeAllPermissions(roleId: number | string): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ROLE_PERMISSIONS.REMOVE_ALL(roleId)}`;
        return this.http.request(HTTP_METHOD.DELETE, url, {
            observeResponse: true
        });
    }
}
