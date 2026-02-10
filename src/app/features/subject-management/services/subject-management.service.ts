import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { Subject, SubjectGroup } from '../models/subject.model';

@Injectable({
    providedIn: 'root'
})
export class SubjectManagementService {
    constructor(private http: HttpClient) { }

    getSubjects(): Observable<HttpResponse<Subject[]>> {
        return this.http.get<Subject[]>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.GET_ALL, { observe: 'response' });
    }

    getSubjectById(id: string): Observable<HttpResponse<Subject>> {
        return this.http.get<Subject>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.GET_BY_ID(id), { observe: 'response' });
    }

    saveSubject(id: string | null, data: any): Observable<HttpResponse<Subject>> {
        if (id) {
            return this.http.put<Subject>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.UPDATE(id), data, { observe: 'response' });
        }
        return this.http.post<Subject>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.CREATE, data, { observe: 'response' });
    }

    deleteSubject(id: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.DELETE(id), { observe: 'response' });
    }

    getSubjectGroups(): Observable<HttpResponse<SubjectGroup[]>> {
        return this.http.get<SubjectGroup[]>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.GET_ALL, { observe: 'response' });
    }
}
