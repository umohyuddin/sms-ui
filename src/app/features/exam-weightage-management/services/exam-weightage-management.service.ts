import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
    providedIn: 'root'
})
export class ExamWeightageManagementService {

    private baseUrl = '';

    constructor(private http: HttpClientService, private appConfig: AppConfigService) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

    getExamTermsByYear(academicYearId: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.GET_BY_TENANT}?academicYearId=${academicYearId}`,
            { observeResponse: true }
        );
    }

    getStandardSubjects(standardId: string | number, academicYearId: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.STANDARD_SUBJECTS.GET_BY_STANDARD}?standardId=${standardId}&academicYearId=${academicYearId}`,
            { observeResponse: true }
        );
    }

    getWeightagesByStandardId(standardId: string | number): Observable<any> {
        return this.http.request(
            HTTP_METHOD.GET,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.WEIGHTAGES.GET_BY_STANDARD(standardId)}`,
            { observeResponse: true }
        );
    }

    saveWeightage(payload: any): Observable<any> {
        return this.http.request(
            HTTP_METHOD.POST,
            `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.WEIGHTAGES.SAVE_BULK}`,
            {
                observeResponse: true,
                body: payload
            }
        );
    }
}
