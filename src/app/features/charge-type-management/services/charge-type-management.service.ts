import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { ChargeTypeRequest } from '../models/ChargeTypeRequest';
import { ChargeTypeResponse } from '../models/ChargeTypeResponse';

@Injectable({
    providedIn: 'root'
})
export class ChargeTypeManagementService {
    private baseUrl = '';

    constructor(private http: HttpClientService, private appConfig: AppConfigService) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

    getAll(): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CHARGE_TYPES.GET_ALL}`, { observeResponse: true });
    }

    getActive(): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CHARGE_TYPES.GET_ACTIVE}`, { observeResponse: true });
    }

    getById(id: string | number): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CHARGE_TYPES.GET_BY_ID(id.toString())}`, { observeResponse: true });
    }

    create(request: ChargeTypeRequest): Observable<any> {
        return this.http.request(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CHARGE_TYPES.CREATE}`, {
            observeResponse: true,
            body: request
        });
    }

    update(id: string | number, request: ChargeTypeRequest): Observable<any> {
        return this.http.request(HTTP_METHOD.PUT, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CHARGE_TYPES.UPDATE(id.toString())}`, {
            observeResponse: true,
            body: request
        });
    }

    delete(id: string | number): Observable<any> {
        return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CHARGE_TYPES.DELETE(id.toString())}`, { observeResponse: true });
    }

    search(keyword: string): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CHARGE_TYPES.SEARCH(keyword)}`, { observeResponse: true });
    }
}
