import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { Subject, SubjectGroup } from '../models/subject.model';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';

@Injectable({
    providedIn: 'root'
})
export class SubjectManagementService {
    private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService
  ) {
    this.baseUrl = this.appConfig.apiBaseUrl;
    console.log('Subject API Base URL:', this.baseUrl);
  }

  /** Get all subjects */
  getSubjects(): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.GET_ALL}`,
      { observeResponse: true }
    );
  }

  /** Get subject by ID */
  getSubjectById(id: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }

  /** Create or update subject */
  saveSubject(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  /** Delete subject */
  deleteSubject(id: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.DELETE,
      `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECTS.DELETE(id)}`,
      { observeResponse: true }
    );
  }

  /** Get all subject groups */
  getSubjectGroups(): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.GET_ALL}`,
      { observeResponse: true }
    );
  }
}