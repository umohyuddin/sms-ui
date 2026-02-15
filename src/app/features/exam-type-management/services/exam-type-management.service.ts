import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { ExamTypeRequestDTO } from '../models/exam-type.model';

@Injectable({
    providedIn: 'root'
})
export class ExamTypeManagementService {
    private baseUrl = '';

    constructor(
        private http: HttpClientService,
        private appConfig: AppConfigService
    ) {
        this.baseUrl = this.appConfig.apiBaseUrl;
    }

    /** Get all exam types */
    getExamTypes(): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TYPES.GET_ALL}`,
            { observeResponse: true }
        );
    }

    /** Get exam type by ID */
    getExamTypeById(id: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TYPES.GET_BY_ID(id)}`,
            { observeResponse: true }
        );
    }

    /** Search exam types by keyword */
    searchExamTypes(keyword: string): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TYPES.SEARCH(keyword)}`,
            { observeResponse: true }
        );
    }

    /** Create or update exam type */
    saveExamType(id: number | null, payload: ExamTypeRequestDTO): Observable<any> {
        const isUpdate = !!id;
        const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

        const url = isUpdate
            ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TYPES.UPDATE(id)}`
            : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TYPES.CREATE}`;

        return this.http.request(method, url, {
            observeResponse: true,
            body: payload
        });
    }

    /** Delete exam type */
    deleteExamType(id: number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.DELETE,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TYPES.DELETE(id)}`,
            { observeResponse: true }
        );
    }
}
