import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

export interface ExamAttendanceSummaryDTO {
    id: number;
    name: string;
    totalStudents: number;
    presentStudents: number;
    absentStudents: number;
    ufmStudents: number;
    attendancePercentage: number;
}

export interface ExamAttendanceDetailDTO {
    attendanceId: number;
    studentId: number;
    studentName: string;
    studentCode: string;
    campusName: string;
    standardName: string;
    sectionName: string;
    subjectName: string;
    examDate: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class StudentExamAttendanceManagementService {

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

    recordAttendance(payload: any): Observable<any> {
        return this.http.request(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.EXAM_ATTENDANCE.RECORD}`, {
            observeResponse: true,
            body: payload
        });
    }

    getAttendanceBySubject(examSubjectId: string | number): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.EXAM_ATTENDANCE.GET_BY_SUBJECT}`, {
            observeResponse: true,
            params: { examSubjectId: examSubjectId.toString() }
        });
    }

    getCampusSummary(academicYearId?: number): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.CAMPUS_SUMMARY}`, {
            observeResponse: true,
            params: academicYearId ? { academicYearId: academicYearId.toString() } : {}
        });
    }

    getStandardSummary(campusId: number, academicYearId?: number): Observable<any> {
        const params: any = {};
        if (campusId) params.campusId = campusId.toString();
        if (academicYearId) params.academicYearId = academicYearId.toString();
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.STANDARD_SUMMARY}`, {
            observeResponse: true,
            params: params
        });
    }

    getSectionSummary(standardId: number, academicYearId?: number): Observable<any> {
        const params: any = {};
        if (standardId) params.standardId = standardId.toString();
        if (academicYearId) params.academicYearId = academicYearId.toString();
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.SECTION_SUMMARY}`, {
            observeResponse: true,
            params: params
        });
    }

    getSubjectSummary(sectionId: number, academicYearId?: number): Observable<any> {
        const params: any = {};
        if (sectionId) params.sectionId = sectionId.toString();
        if (academicYearId) params.academicYearId = academicYearId.toString();
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.SUBJECT_SUMMARY}`, {
            observeResponse: true,
            params: params
        });
    }

    getDetailedReport(filters: any): Observable<any> {
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.DETAILED}`, {
            observeResponse: true,
            params: filters
        });
    }
}
