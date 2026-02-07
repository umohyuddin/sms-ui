import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';

@Injectable({
    providedIn: 'root'
})
export class ActionService {
    private baseUrl = '';

    constructor(
        private http: HttpClientService,
        private appConfig: AppConfigService
    ) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

    getAllActions(): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ACTIONS.GET_ALL}`;
        console.log('🔗 Calling URL:', url);
        return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(
            map((res: any) => {
                console.log('📦 Raw HTTP Response:', res);
                console.log('📦 Response Body:', res.body);
                console.log('📦 Body Type:', typeof res.body);
                console.log('📦 Is Body Array:', Array.isArray(res.body));
                return res.body || res;
            })
        );
    }

    getActionById(id: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ACTIONS.GET_BY_ID(id)}`;
        return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true }).pipe(map((res: any) => res.body || res));
    }

    saveAction(id: string | null, payload: any): Observable<any> {
        const isUpdate = !!id;
        const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
        const url = isUpdate
            ? `${this.baseUrl}${API_ENDPOINTS.USERS.ACTIONS.UPDATE(id)}`
            : `${this.baseUrl}${API_ENDPOINTS.USERS.ACTIONS.CREATE}`;

        return this.http.request(method, url, {
            observeResponse: true,
            body: payload
        }).pipe(map((res: any) => res.body || res));
    }

    deleteAction(id: number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ACTIONS.DELETE(id)}`;
        return this.http.request(HTTP_METHOD.DELETE, url, { observeResponse: true });
    }

    searchActions(keyword: string): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.USERS.ACTIONS.SEARCH(keyword)}`;
        return this.http.request(HTTP_METHOD.GET, url, {
            observeResponse: true
        }).pipe(
            map((res: any) => {
                console.log('🔍 Search Response:', res);
                return res.body || res;
            })
        );
    }
}

