import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { ExamTermRequestDTO } from '../models/exam-term.model';

@Injectable({
    providedIn: 'root'
})
export class ExamTermManagementService {
    private baseUrl: string;

    constructor(
        private http: HttpClientService,
        private config: AppConfigService
    ) {
        this.baseUrl = this.config.apiBaseUrl || '';
    }

    /** Get terms by academic year */
    getTermsByYear(academicYearId: number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.GET_BY_YEAR}?academicYearId=${academicYearId}`,
            { observeResponse: true }
        );
    }

    /** Get exam term by ID */
    getExamTermById(id: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.GET_BY_ID(id)}`,
            { observeResponse: true }
        );
    }

    /** Search exam terms by keyword */
    searchExamTerms(keyword: string): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.SEARCH(keyword)}`,
            { observeResponse: true }
        );
    }

    /** Create or update exam term */
    saveExamTerm(id: number | null, payload: ExamTermRequestDTO): Observable<any> {
        const isUpdate = !!id;
        const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

        const url = isUpdate
            ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.UPDATE(id)}`
            : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.CREATE}`;

        return this.http.request(method, url, {
            observeResponse: true,
            body: payload
        });
    }

    /** Delete exam term */
    deleteExamTerm(id: number | string): Observable<any> {
        return this.http.request(
            HTTP_METHOD.DELETE,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.DELETE(id)}`,
            { observeResponse: true }
        );
    }
}
