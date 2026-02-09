import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService, private logger: LoggerService) {
    this.baseUrl = appConfig.apiBaseUrl;
    this.logger.info('API Base URL', this.appConfig.apiBaseUrl);
  }

  getAcademicYears(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_ALL}`, { observeResponse: true });
  }

  getCurrentAcademicYear(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_CURRENT}`, { observeResponse: true });
  }

  getAcademicYearById(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }


  saveAcademicYear(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;

    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }
  searchAcademicYears(params: { keyword?: string }): Observable<any> {
    const query = params.keyword ? `?keyword=${encodeURIComponent(params.keyword)}` : '';
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.SEARCH}${query}`;
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }

  activateAcademicYear(id: string): Observable<any> {
    return this.http.request(HTTP_METHOD.PUT, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.ACTIVATE(id)}`,
      {
        observeResponse: true
      }
    );
  }

  deleteAcademicYear(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.DELETE,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.DELETE(id)}`,
      { observeResponse: true }
    );
  }

  makeYearLocked(id: string, payload: any): Observable<any> {
    return this.http.request(
      HTTP_METHOD.PUT,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.MARK_LOCKED(id)}`,
      {
        observeResponse: true,
        body: payload
      }
    );
  }

  archiveAcademicYear(id: string, payload: any): Observable<any> {
    return this.http.request(
      HTTP_METHOD.PUT,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.ARCHIVE(id)}`,
      {
        observeResponse: true,
        body: payload
      }
    );
  }
    createDefaultAcademicYear(): Observable<any> {
    return this.http.request(
      HTTP_METHOD.PUT,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.CREATE_DEFAULT}`,
      { observeResponse: true }
    );
  }

   closeAcademicYear(id: string, payload: any): Observable<any> {
    return this.http.request(
      HTTP_METHOD.PUT,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.CLOSE(id)}`,
      {
        observeResponse: true,
        body: payload
      }
    );
  }
}
