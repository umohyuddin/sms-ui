import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
    providedIn: 'root'
})
export class FeeRecurrenceRuleManagementService {

    private baseUrl = '';

    constructor(private http: HttpClientService, private appConfig: AppConfigService) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

    getAllFeeRecurrenceRules(): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_RECURRENCE_RULES.GET_ALL()}`, { observeResponse: true });
    }

    getFeeRecurrenceRuleById(id: any): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_RECURRENCE_RULES.GET_BY_ID(id)}`, { observeResponse: true });
    }

    saveFeeRecurrenceRule(id: string | number | null, payload: any): Observable<any> {
        const isUpdate = !!id;
        const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
        const url = isUpdate
            ? `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_RECURRENCE_RULES.UPDATE(id.toString())}`
            : `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_RECURRENCE_RULES.CREATE}`;

        return this.http.request(method, url, {
            observeResponse: true,
            body: payload
        });
    }

    searchFeeRecurrenceRules(query: string): Observable<any> {
        const url = query
            ? `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_RECURRENCE_RULES.SEARCH(query)}`
            : `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_RECURRENCE_RULES.GET_ALL()}`;
        return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
    }

    deleteFeeRecurrenceRule(id: any): Observable<any> {
        return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_RECURRENCE_RULES.DELETE(id.toString())}`, { observeResponse: true });
    }

    getStatistics(): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_RECURRENCE_RULES.STATISTICS}`, { observeResponse: true });
    }
}
