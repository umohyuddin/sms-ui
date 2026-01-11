import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { SalaryComponentResponse } from '../models/SalaryComponent';

@Injectable({
  providedIn: 'root'
})
export class SalaryComponentService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getSalaryComponentMeta(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.SALARY_COMPONENT.META}`, { observeResponse: true });
  }

  getAllSalaryComponents(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.SALARY_COMPONENT.GET_ALL}`, { observeResponse: true });
  }

  getSalaryComponentById(id: string): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.SALARY_COMPONENT.GET_BY_ID(id.toString())}`, { observeResponse: true });
  }

  saveSalaryComponent(id: string | null, payload: SalaryComponentResponse): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate ? `${this.baseUrl}${API_ENDPOINTS.SALARY_COMPONENT.UPDATE(id.toString())}` : `${this.baseUrl}${API_ENDPOINTS.SALARY_COMPONENT.CREATE}`;
    return this.http.request(method, url, { observeResponse: true, body: payload });
  }

  searchSalaryComponents(query: string): Observable<any> {
    const url = query ? `${this.baseUrl}${API_ENDPOINTS.SALARY_COMPONENT.SEARCH(query)}` : `${this.baseUrl}${API_ENDPOINTS.SALARY_COMPONENT.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }
}
