import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectGroup } from '../models/subject-group.model';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';

@Injectable({
    providedIn: 'root'
})
export class SubjectGroupManagementService {

  private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService
  ) {
    this.baseUrl = this.appConfig.apiBaseUrl;
    console.log('API Base URL:', this.baseUrl);
  }

  /** Get all subject groups */
  getSubjectGroups(): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.GET_ALL}`,
      { observeResponse: true }
    );
  }

  /** Get subject group by ID */
  getSubjectGroupById(id: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }

  /** Create or update subject group */
  saveSubjectGroup(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  /** Delete subject group */
  deleteSubjectGroup(id: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.DELETE,
      `${this.baseUrl}${API_ENDPOINTS.ACADEMIC.CORE.SUBJECT_GROUPS.DELETE(id)}`,
      { observeResponse: true }
    );
  }
}