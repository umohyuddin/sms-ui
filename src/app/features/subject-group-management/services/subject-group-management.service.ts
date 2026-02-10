import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectGroup } from '../models/subject-group.model';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
    providedIn: 'root'
})
export class SubjectGroupManagementService {
    constructor(private http: HttpClient) { }

    getSubjectGroups(): Observable<HttpResponse<SubjectGroup[]>> {
        return this.http.get<SubjectGroup[]>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.GET_ALL, { observe: 'response' });
    }

    getSubjectGroupById(id: string): Observable<HttpResponse<SubjectGroup>> {
        return this.http.get<SubjectGroup>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.GET_BY_ID(id), { observe: 'response' });
    }

    saveSubjectGroup(id: string | null, data: any): Observable<HttpResponse<SubjectGroup>> {
        if (id) {
            return this.http.put<SubjectGroup>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.UPDATE(id), data, { observe: 'response' });
        }
        return this.http.post<SubjectGroup>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.CREATE, data, { observe: 'response' });
    }

    deleteSubjectGroup(id: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.DELETE(id), { observe: 'response' });
    }
}
