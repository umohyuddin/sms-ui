import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { ExamRequestDTO } from '../models/exam.model';

@Injectable({
    providedIn: 'root'
})
export class ExamManagementService {
    private baseUrl: string;

    constructor(
        private http: HttpClientService,
        private config: AppConfigService
    ) {
        this.baseUrl = this.config.apiBaseUrl || '';
    }

    /** Get all exams with optional filtering */
    getExams(filters: any = {}): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.GET_ALL}`,
            {
                observeResponse: true,
                params: filters
            }
        );
    }

    /** Get exams by section, standard and academic year (Optimized) */
    getExamsBySection(standardId: string | number, sectionId: string | number, academicYearId: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.GET_BY_SECTION}`,
            {
                observeResponse: true,
                params: {
                    standardId: standardId.toString(),
                    sectionId: sectionId.toString(),
                    academicYearId: academicYearId.toString()
                }
            }
        );
    }

    /** Get exam by ID */
    getExamById(id: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.GET_BY_ID(id)}`,
            { observeResponse: true }
        );
    }

    /** Search exams */
    searchExams(filters: any = {}): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.SEARCH}`,
            {
                observeResponse: true,
                params: filters
            }
        );
    }

    /** Save or Update exam */
    saveExam(id: number | null, payload: ExamRequestDTO): Observable<any> {
        const isUpdate = !!id;
        const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
        const url = isUpdate
            ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.UPDATE(id)}`
            : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.CREATE}`;

        return this.http.request(method, url, {
            observeResponse: true,
            body: payload
        });
    }

    /** Delete exam */
    deleteExam(id: number | string): Observable<any> {
        return this.http.request(
            HTTP_METHOD.DELETE,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.DELETE(id)}`,
            { observeResponse: true }
        );
    }
}
