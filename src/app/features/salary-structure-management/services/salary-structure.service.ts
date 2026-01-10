import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { AppConfigService } from '../../../core/services/app-config.service';
import { HttpClientService } from '../../../core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SalaryStructureService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.baseUrl);
  }

  /** Create or Update Salary Structure */
  saveSalaryStructure(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE.CREATE}`;
    return this.http.request(method, url, { observeResponse: true, body: payload });
  }

  closeSalaryStructure(id: string): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE.CLOSE(id)}`;
    return this.http.request(HTTP_METHOD.PUT, url, { observeResponse: true });
  }
  /** Get all Salary Structures */
  getAllSalaryStructures(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE.GET_ALL}`, { observeResponse: true });
  }



  /** Get Salary Structure by ID */
  getSalaryStructureById(id: string): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE.GET_BY_ID(id)}`, { observeResponse: true });
  }

  /** Search Salary Structures */
  searchSalaryStructures(params: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE.SEARCH}`, { observeResponse: true, params });
  }

  /** Delete Salary Structure */
  deleteSalaryStructure(id: string): Observable<any> {
    return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE.DELETE(id)}`, { observeResponse: true });
  }
}