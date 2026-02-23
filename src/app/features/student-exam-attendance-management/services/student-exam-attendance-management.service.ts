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
    private useDummyData = true; // Set to false to use real API data

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
        if (this.useDummyData) {
            return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.CAMPUS_SUMMARY}`, {
                observeResponse: true,
                params: academicYearId ? { academicYearId: academicYearId.toString() } : {}
            }).pipe(
                map((response: any) => {
                    // Combine real data with dummy data
                    const realData = response.body || [];
                    const dummyData = this.generateDummyCampusData(15);
                    return { ...response, body: [...realData, ...dummyData] };
                })
            );
        }
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.CAMPUS_SUMMARY}`, {
            observeResponse: true,
            params: academicYearId ? { academicYearId: academicYearId.toString() } : {}
        });
    }

    getStandardSummary(campusId: number, academicYearId?: number): Observable<any> {
        if (this.useDummyData) {
            return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.STANDARD_SUMMARY}`, {
                observeResponse: true,
                params: { campusId: campusId.toString() }
            }).pipe(
                map((response: any) => {
                    const realData = response.body || [];
                    const dummyData = this.generateDummyStandardData(12);
                    return { ...response, body: [...realData, ...dummyData] };
                })
            );
        }
        const params: any = {};
        if (campusId) params.campusId = campusId.toString();
        if (academicYearId) params.academicYearId = academicYearId.toString();
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.STANDARD_SUMMARY}`, {
            observeResponse: true,
            params: params
        });
    }

    getSectionSummary(standardId: number, academicYearId?: number): Observable<any> {
        if (this.useDummyData) {
            return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.SECTION_SUMMARY}`, {
                observeResponse: true,
                params: { standardId: standardId.toString() }
            }).pipe(
                map((response: any) => {
                    const realData = response.body || [];
                    const dummyData = this.generateDummySectionData(8);
                    return { ...response, body: [...realData, ...dummyData] };
                })
            );
        }
        const params: any = {};
        if (standardId) params.standardId = standardId.toString();
        if (academicYearId) params.academicYearId = academicYearId.toString();
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.SECTION_SUMMARY}`, {
            observeResponse: true,
            params: params
        });
    }

    getSubjectSummary(sectionId: number, academicYearId?: number): Observable<any> {
        if (this.useDummyData) {
            return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.SUBJECT_SUMMARY}`, {
                observeResponse: true,
                params: { sectionId: sectionId.toString() }
            }).pipe(
                map((response: any) => {
                    const realData = response.body || [];
                    const dummyData = this.generateDummySubjectData(10);
                    return { ...response, body: [...realData, ...dummyData] };
                })
            );
        }
        const params: any = {};
        if (sectionId) params.sectionId = sectionId.toString();
        if (academicYearId) params.academicYearId = academicYearId.toString();
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.SUBJECT_SUMMARY}`, {
            observeResponse: true,
            params: params
        });
    }

    getDetailedReport(filters: any): Observable<any> {
        if (this.useDummyData) {
            return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.DETAILED}`, {
                observeResponse: true,
                params: filters
            }).pipe(
                map((response: any) => {
                    const realData = response.body || [];
                    const dummyData = this.generateDummyDetailedData(50);
                    return { ...response, body: [...realData, ...dummyData] };
                })
            );
        }
        return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.REPORTS.DETAILED}`, {
            observeResponse: true,
            params: filters
        });
    }

    // Dummy data generators
    private generateDummyCampusData(count: number): any[] {
        const campusNames = ['Downtown Campus', 'Northside Campus', 'Eastgate Campus', 'Westwood Campus', 
                            'Riverside Campus', 'Hillside Campus', 'Lakeside Campus', 'Meadow Campus',
                            'Valley Campus', 'Mountain View Campus', 'Sunset Campus', 'Sunrise Campus',
                            'Central Campus', 'Harbor Campus', 'Forest Campus'];
        
        return Array.from({ length: count }, (_, i) => {
            const total = Math.floor(Math.random() * 200) + 100;
            const present = Math.floor(total * (0.7 + Math.random() * 0.25));
            const absent = Math.floor((total - present) * 0.8);
            const ufm = total - present - absent;
            return {
                groupId: 1000 + i,
                groupName: campusNames[i] || `Campus ${i + 1}`,
                totalStudents: total,
                presentCount: present,
                absentCount: absent,
                ufmCount: ufm,
                attendancePercentage: parseFloat(((present / total) * 100).toFixed(2))
            };
        });
    }

    private generateDummyStandardData(count: number): any[] {
        const standardNames = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
                              'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
        
        return Array.from({ length: count }, (_, i) => {
            const total = Math.floor(Math.random() * 150) + 80;
            const present = Math.floor(total * (0.75 + Math.random() * 0.2));
            const absent = Math.floor((total - present) * 0.75);
            const ufm = total - present - absent;
            return {
                groupId: 2000 + i,
                groupName: standardNames[i] || `Standard ${i + 1}`,
                totalStudents: total,
                presentCount: present,
                absentCount: absent,
                ufmCount: ufm,
                attendancePercentage: parseFloat(((present / total) * 100).toFixed(2))
            };
        });
    }

    private generateDummySectionData(count: number): any[] {
        const sections = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E', 
                         'Section F', 'Section G', 'Section H'];
        
        return Array.from({ length: count }, (_, i) => {
            const total = Math.floor(Math.random() * 50) + 30;
            const present = Math.floor(total * (0.8 + Math.random() * 0.15));
            const absent = Math.floor((total - present) * 0.7);
            const ufm = total - present - absent;
            return {
                groupId: 3000 + i,
                groupName: sections[i] || `Section ${String.fromCharCode(65 + i)}`,
                totalStudents: total,
                presentCount: present,
                absentCount: absent,
                ufmCount: ufm,
                attendancePercentage: parseFloat(((present / total) * 100).toFixed(2))
            };
        });
    }

    private generateDummySubjectData(count: number): any[] {
        const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Physics', 
                         'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science',
                         'Physical Education', 'Art', 'Music', 'Economics'];
        
        return Array.from({ length: count }, (_, i) => {
            const total = Math.floor(Math.random() * 50) + 25;
            const present = Math.floor(total * (0.75 + Math.random() * 0.2));
            const absent = Math.floor((total - present) * 0.8);
            const ufm = total - present - absent;
            return {
                groupId: 4000 + i,
                groupName: subjects[i] || `Subject ${i + 1}`,
                totalStudents: total,
                presentCount: present,
                absentCount: absent,
                ufmCount: ufm,
                attendancePercentage: parseFloat(((present / total) * 100).toFixed(2))
            };
        });
    }

    private generateDummyDetailedData(count: number): any[] {
        const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava',
                           'Robert', 'Isabella', 'David', 'Mia', 'Richard', 'Charlotte', 'Joseph'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
                          'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
        const statuses = ['PRESENT', 'ABSENT', 'UFM'];
        const statusWeights = [0.8, 0.15, 0.05];
        
        return Array.from({ length: count }, (_, i) => {
            const rand = Math.random();
            let status = 'PRESENT';
            if (rand > statusWeights[0] + statusWeights[1]) status = 'UFM';
            else if (rand > statusWeights[0]) status = 'ABSENT';
            
            return {
                attendanceId: 5000 + i,
                studentId: 10000 + i,
                studentName: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
                studentCode: `STU${(10000 + i).toString().padStart(5, '0')}`,
                campusName: 'Test Campus',
                standardName: 'Grade 10',
                sectionName: 'Section A',
                subjectName: 'Mathematics',
                examDate: new Date(2026, 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                status: status
            };
        });
    }
}
