import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
    providedIn: 'root'
})
export class StudentExamMarksManagementService {

    private baseUrl = '';

    constructor(private http: HttpClientService, private appConfig: AppConfigService) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

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

    getExamSubjects(examId: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_SUBJECTS.GET_BY_EXAM}`,
            {
                observeResponse: true,
                params: { examId: examId.toString() }
            }
        );
    }

    recordMarks(payload: any): Observable<any> {
        return this.http.request(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.MARKS.RECORD}`, {
            observeResponse: true,
            body: payload
        });
    }

    getMarksBySubject(subjectId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.MARKS.GET_BY_SUBJECT(subjectId)}`;
        return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
    }

    getMarksByStudent(studentId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.MARKS.GET_BY_STUDENT(studentId)}`;
        return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
    }
}
