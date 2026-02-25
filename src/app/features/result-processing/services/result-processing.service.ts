import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
    providedIn: 'root'
})
export class ResultProcessingService {

    private baseUrl = '';

    constructor(private http: HttpClientService, private appConfig: AppConfigService) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

    private crud(method: any, url: string, payload?: any): Observable<any> {
        return this.http.request(method, url, { observeResponse: true, body: payload });
    }

    getExamTerms(academicYearId: string | number): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.GET_BY_YEAR}?academicYearId=${academicYearId}`);
    }

    processResults(standardId: number, sectionId: number, examTermId: number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.PROCESS}?standardId=${standardId}&sectionId=${sectionId}&examTermId=${examTermId}`;
        return this.crud(HTTP_METHOD.POST, url);
    }

    generateReportCard(payload: any): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.REPORT_CARDS.GENERATE}`, payload);
    }

    getGradeScales(): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.GRADE_SCALES.GET_ALL}`);
    }

    saveGradeScale(id: number | string | null, payload: any): Observable<any> {
        const url = id ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.GRADE_SCALES.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.GRADE_SCALES.CREATE}`;
        return this.crud(id ? HTTP_METHOD.PUT : HTTP_METHOD.POST, url, payload);
    }
}
