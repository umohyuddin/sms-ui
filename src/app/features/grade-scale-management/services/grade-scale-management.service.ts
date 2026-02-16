import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { GradeScaleRequestDTO } from '../models/grade-scale.model';

@Injectable({
    providedIn: 'root'
})
export class GradeScaleManagementService {
    private baseUrl: string;

    constructor(
        private http: HttpClientService,
        private config: AppConfigService
    ) {
        this.baseUrl = this.config.apiBaseUrl || '';
    }

    /** Get all grade scales */
    getGradeScales(): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.GRADE_SCALES.GET_ALL}`,
            { observeResponse: true }
        );
    }

    /** Get grade scale by ID */
    getGradeScaleById(id: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.GRADE_SCALES.GET_BY_ID(id)}`,
            { observeResponse: true }
        );
    }

    /** Search grade scales by keyword */
    searchGradeScales(keyword: string): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.GRADE_SCALES.SEARCH(keyword)}`,
            { observeResponse: true }
        );
    }

    /** Create or update grade scale */
    saveGradeScale(id: number | null, payload: GradeScaleRequestDTO): Observable<any> {
        const isUpdate = !!id;
        const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

        const url = isUpdate
            ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.GRADE_SCALES.UPDATE(id)}`
            : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.GRADE_SCALES.CREATE}`;

        return this.http.request(method, url, {
            observeResponse: true,
            body: payload
        });
    }

    /** Delete grade scale */
    deleteGradeScale(id: number | string): Observable<any> {
        return this.http.request(
            HTTP_METHOD.DELETE,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.GRADE_SCALES.DELETE(id)}`,
            { observeResponse: true }
        );
    }
}
