import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { AssessmentTypeRequestDTO } from '../models/assessment-type.model';

@Injectable({
    providedIn: 'root'
})
export class AssessmentTypeManagementService {
    private baseUrl: string;

    constructor(
        private http: HttpClientService,
        private config: AppConfigService
    ) {
        this.baseUrl = this.config.apiBaseUrl || '';
    }

    /** Get all assessment types */
    getAssessmentTypes(): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.ASSESSMENT_TYPES.GET_ALL}`,
            { observeResponse: true }
        );
    }

    /** Get assessment type by ID */
    getAssessmentTypeById(id: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.ASSESSMENT_TYPES.GET_BY_ID(id)}`,
            { observeResponse: true }
        );
    }

    /** Search assessment types by keyword */
    searchAssessmentTypes(keyword: string): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.ASSESSMENT_TYPES.SEARCH(keyword)}`,
            { observeResponse: true }
        );
    }

    /** Create or update assessment type */
    saveAssessmentType(id: number | null, payload: AssessmentTypeRequestDTO): Observable<any> {
        const isUpdate = !!id;
        const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

        const url = isUpdate
            ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.ASSESSMENT_TYPES.UPDATE(id)}`
            : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.ASSESSMENT_TYPES.CREATE}`;

        return this.http.request(method, url, {
            observeResponse: true,
            body: payload
        });
    }

    /** Delete assessment type */
    deleteAssessmentType(id: number | string): Observable<any> {
        return this.http.request(
            HTTP_METHOD.DELETE,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.ASSESSMENT_TYPES.DELETE(id)}`,
            { observeResponse: true }
        );
    }
}
