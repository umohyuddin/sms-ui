import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
    providedIn: 'root'
})
export class ExamSubjectManagementService {

    private baseUrl = '';

    constructor(private http: HttpClientService, private appConfig: AppConfigService) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

    getExamSubjects(examId: string | number): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_SUBJECTS.GET_BY_EXAM}`, {
            observeResponse: true,
            params: { examId: examId.toString() }
        });
    }

    scheduleExamSubject(payload: any): Observable<any> {
        return this.http.request(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_SUBJECTS.SCHEDULE}`, {
            observeResponse: true,
            body: payload
        });
    }

    bulkScheduleSubjects(payload: any): Observable<any> {
        return this.http.request(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_SUBJECTS.BULK_SCHEDULE}`, {
            observeResponse: true,
            body: payload
        });
    }

    unscheduleExamSubject(params: any): Observable<any> {
        return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_SUBJECTS.UNSCHEDULE}`, {
            observeResponse: true,
            params: params
        });
    }

    getStandardSubjects(standardId: string | number, academicYearId: string | number): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.STANDARD_SUBJECTS.GET_BY_STANDARD}`, {
            observeResponse: true,
            params: { standardId: standardId.toString(), academicYearId: academicYearId.toString() }
        });
    }

    getExamTermsByTenant(academicYearId: string | number): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.GET_BY_TENANT}`, {
            observeResponse: true,
            params: { academicYearId: academicYearId.toString() }
        });
    }

    searchExams(params: any): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.SEARCH}`, {
            observeResponse: true,
            params: params
        });
    }

    // Add more methods as needed, mirroring CampusManagementService patterns
}
