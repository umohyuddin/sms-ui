import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
    providedIn: 'root'
})
export class AcademicManagementService {

    private baseUrl = '';

    constructor(private http: HttpClientService, private appConfig: AppConfigService) {
        this.baseUrl = appConfig.apiBaseUrl;
    }

    // --- Helper for Generic CRUD ---
    private crud(method: any, url: string, payload?: any): Observable<any> {
        return this.http.request(method, url, { observeResponse: true, body: payload });
    }

    // --- 1. Core Academics ---

    // Subject Groups
    getSubjectGroups(): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.GROUPS.GET_ALL}`);
    }
    getSubjectGroupById(id: number | string): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.GROUPS.GET_BY_ID(id)}`);
    }
    saveSubjectGroup(id: number | string | null, payload: any): Observable<any> {
        const url = id ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.GROUPS.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.GROUPS.CREATE}`;
        return this.crud(id ? HTTP_METHOD.PUT : HTTP_METHOD.POST, url, payload);
    }
    deleteSubjectGroup(id: number | string): Observable<any> {
        return this.crud(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.GROUPS.DELETE(id)}`);
    }

    // Subjects
    getSubjects(): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.GET_ALL}`);
    }
    getSubjectById(id: number | string): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.GET_BY_ID(id)}`);
    }
    saveSubject(id: number | string | null, payload: any): Observable<any> {
        const url = id ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.CREATE}`;
        return this.crud(id ? HTTP_METHOD.PUT : HTTP_METHOD.POST, url, payload);
    }
    deleteSubject(id: number | string): Observable<any> {
        return this.crud(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.DELETE(id)}`);
    }

    // Standard Subject Assignment
    assignSubjectToStandard(payload: any): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.STANDARD_SUBJECTS.ASSIGN}`, payload);
    }
    bulkAssignSubjectsToStandard(payload: any): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.STANDARD_SUBJECTS.BULK_ASSIGN}`, payload);
    }
    getStandardSubjects(standardId: string | number, academicYearId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.STANDARD_SUBJECTS.GET_BY_STANDARD}?standardId=${standardId}&academicYearId=${academicYearId}`;
        return this.crud(HTTP_METHOD.GET, url);
    }
    unassignSubjectFromStandard(standardId: string | number, subjectId: string | number, academicYearId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.STANDARD_SUBJECTS.UNASSIGN}?standardId=${standardId}&subjectId=${subjectId}&academicYearId=${academicYearId}`;
        return this.crud(HTTP_METHOD.DELETE, url);
    }

    bulkUnassignSubjectsFromStandard(standardId: string | number, subjectIds: number[], academicYearId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.STANDARD_SUBJECTS.BULK_UNASSIGN}?standardId=${standardId}&subjectIds=${subjectIds.join(',')}&academicYearId=${academicYearId}`;
        return this.crud(HTTP_METHOD.DELETE, url);
    }

    updateStandardSubjectMapping(id: number | string, payload: any): Observable<any> {
        return this.crud(HTTP_METHOD.PUT, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.STANDARD_SUBJECTS.UPDATE(id)}`, payload);
    }

    // --- 2. Scheduling ---

    assignTeacher(payload: any): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.ASSIGNMENTS.CREATE}`, payload);
    }
    getTeacherAssignments(employeeId: string | number): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.ASSIGNMENTS.GET_BY_TEACHER(employeeId)}`);
    }
    getSectionAssignments(standardId: string | number, sectionId: string | number, academicYearId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.ASSIGNMENTS.GET_BY_SECTION}?standardId=${standardId}&sectionId=${sectionId}&academicYearId=${academicYearId}`;
        return this.crud(HTTP_METHOD.GET, url);
    }
    getStandardAssignments(standardId: string | number, academicYearId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.ASSIGNMENTS.GET_BY_STANDARD}?standardId=${standardId}&academicYearId=${academicYearId}`;
        return this.crud(HTTP_METHOD.GET, url);
    }
    unassignTeacher(params: any): Observable<any> {
        const query = new URLSearchParams(params).toString();
        return this.crud(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.ASSIGNMENTS.DELETE}?${query}`);
    }

    // Timetable
    saveTimetable(id: number | string | null, payload: any): Observable<any> {
        const url = id ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.TIMETABLE.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.TIMETABLE.CREATE}`;
        return this.crud(id ? HTTP_METHOD.PUT : HTTP_METHOD.POST, url, payload);
    }
    getSectionTimetable(standardId: string | number, sectionId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.TIMETABLE.GET_SECTION}?standardId=${standardId}&sectionId=${sectionId}`;
        return this.crud(HTTP_METHOD.GET, url);
    }
    getTeacherTimetable(id: string | number, day: string): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.TIMETABLE.GET_TEACHER(id)}?day=${day}`;
        return this.crud(HTTP_METHOD.GET, url);
    }
    deleteTimetable(id: number | string): Observable<any> {
        return this.crud(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.SCHEDULING.TIMETABLE.DELETE(id)}`);
    }

    // --- 3. Attendance ---

    markStudentAttendance(payload: any[]): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.ATTENDANCE.STUDENTS.MARK}`, payload);
    }
    getSectionAttendance(standardId: string | number, sectionId: string | number, date: string): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.ATTENDANCE.STUDENTS.GET_SECTION}?standardId=${standardId}&sectionId=${sectionId}&date=${date}`;
        return this.crud(HTTP_METHOD.GET, url);
    }
    getStudentMonthlyAttendance(id: string | number, month: number, year: number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.ATTENDANCE.STUDENTS.GET_MONTHLY(id)}?month=${month}&year=${year}`;
        return this.crud(HTTP_METHOD.GET, url);
    }
    markEmployeeAttendance(payload: any[]): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.ATTENDANCE.EMPLOYEES.MARK}`, payload);
    }
    getEmployeeMonthlyAttendance(id: string | number, month: number, year: number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.ATTENDANCE.EMPLOYEES.GET_MONTHLY(id)}?month=${month}&year=${year}`;
        return this.crud(HTTP_METHOD.GET, url);
    }

    // --- 4. Evaluation ---

    // Exam Types & Terms
    getExamTypes(): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TYPES.GET_ALL}`);
    }
    saveExamType(id: number | string | null, payload: any): Observable<any> {
        const url = id ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TYPES.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TYPES.CREATE}`;
        return this.crud(id ? HTTP_METHOD.PUT : HTTP_METHOD.POST, url, payload);
    }
    getExamTerms(academicYearId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.GET_BY_YEAR}?academicYearId=${academicYearId}`;
        return this.crud(HTTP_METHOD.GET, url);
    }
    saveExamTerm(id: number | string | null, payload: any): Observable<any> {
        const url = id ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_TERMS.CREATE}`;
        return this.crud(id ? HTTP_METHOD.PUT : HTTP_METHOD.POST, url, payload);
    }

    // Exams
    saveExam(id: number | string | null, payload: any): Observable<any> {
        const url = id ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.CREATE}`;
        return this.crud(id ? HTTP_METHOD.PUT : HTTP_METHOD.POST, url, payload);
    }
    getExamsBySection(standardId: string | number, sectionId: string | number, academicYearId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAMS.GET_BY_SECTION}?standardId=${standardId}&sectionId=${sectionId}&academicYearId=${academicYearId}`;
        return this.crud(HTTP_METHOD.GET, url);
    }
    scheduleExamSubject(payload: any): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_SUBJECTS.SCHEDULE}`, payload);
    }
    getExamSubjects(examId: string | number): Observable<any> {
        const url = `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.EXAM_SUBJECTS.GET_BY_EXAM}?examId=${examId}`;
        return this.crud(HTTP_METHOD.GET, url);
    }

    // Assessments
    saveAssessment(id: number | string | null, payload: any): Observable<any> {
        const url = id ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.ASSESSMENTS.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.ASSESSMENTS.CREATE}`;
        return this.crud(id ? HTTP_METHOD.PUT : HTTP_METHOD.POST, url, payload);
    }
    getAssessmentsByAssignment(assignmentId: string | number): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.ASSESSMENTS.GET_BY_ASSIGNMENT(assignmentId)}`);
    }
    submitAssessment(payload: any): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.STUDENT_ASSESSMENTS.SUBMIT}`, payload);
    }
    evaluateAssessment(payload: any): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.EVALUATION.STUDENT_ASSESSMENTS.EVALUATE}`, payload);
    }

    // --- 5. Results ---

    recordExamMarks(payload: any[]): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.MARKS.RECORD}`, payload);
    }
    getMarksByExamSubject(id: string | number): Observable<any> {
        return this.crud(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.MARKS.GET_BY_SUBJECT(id)}`);
    }
    saveExamWeightages(payload: any[]): Observable<any> {
        return this.crud(HTTP_METHOD.POST, `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.RESULTS.WEIGHTAGES.SAVE}`, payload);
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
