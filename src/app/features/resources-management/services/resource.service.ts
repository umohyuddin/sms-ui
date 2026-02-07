import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {
    private baseUrl = '';

    constructor(
        private http: HttpClientService,
        private appConfig: AppConfigService
    ) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

    getAllResources(): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.RESOURCES.GET_ALL}`;
        return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(
            map((res: any) => {
                console.log('📦 Resources Response:', res);
                console.log('📦 Resources Body:', res.body);
                // API returns array directly in body, not wrapped in data property
                return Array.isArray(res.body) ? res.body : (res.body?.data || []);
            })
        );
    }

    getResourceById(id: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.RESOURCES.GET_BY_ID(id)}`;
        return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(
            map((res: any) => {
                console.log('📦 Resource Detail Response:', res);
                // Handle both wrapped and direct response
                return res.body?.data || res.body;
            })
        );
    }

    saveResource(id: string | null, payload: any): Observable<any> {
        const isUpdate = !!id;
        const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
        const url = isUpdate
            ? `${this.baseUrl}${API_ENDPOINTS.USERS.RESOURCES.UPDATE(id)}`
            : `${this.baseUrl}${API_ENDPOINTS.USERS.RESOURCES.CREATE}`;

        return this.http.request(method, url, {
            observeResponse: true,
            body: payload
        }).pipe(
            map((res: any) => {
                console.log('📦 Save Resource Response:', res);
                return res.body?.data || res.body;
            })
        );
    }

    deleteResource(id: number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.RESOURCES.DELETE(id)}`;
        return this.http.request(HTTP_METHOD.DELETE, url, { observeResponse: true });
    }

    getModules(): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.GET_ALL}`;
        return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(
            map((res: any) => {
                console.log('📦 Modules Response:', res);
                console.log('📦 Modules Body:', res.body);
                // API returns array directly in body, not wrapped in data property
                return Array.isArray(res.body) ? res.body : (res.body?.data || []);
            })
        );
    }
}
