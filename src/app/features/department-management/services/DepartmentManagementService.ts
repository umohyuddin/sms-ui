import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { AppConfigService } from '../../../core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentManagementService {

  private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService
  ) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getAllDepartments(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DEPARTMENTS.GET_ALL}`, { observeResponse: true });
  }

  getDepartmentById(id: string | number): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DEPARTMENTS.GET_BY_ID(id)}`, { observeResponse: true });
  }

  saveDepartment(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DEPARTMENTS.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DEPARTMENTS.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  searchDepartments(query: string): Observable<any> {
    const url = query
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DEPARTMENTS.SEARCH(query)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DEPARTMENTS.GET_ALL}`;

    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.DELETE,
      `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DEPARTMENTS.DELETE(id)}`,
      { observeResponse: true }
    );
  }


  //   assignDepartment(payload: any): Observable<any> {
  //   return this.http.request(
  //     HTTP_METHOD.POST,
  //     `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DEPARTMENTS.ASSIGN}`,
  //     { body: payload, observeResponse: true ,
  //        headers: { 'Content-Type': 'application/json' }
  //     }
  //   );
  // }

    assignDepartment(payload: any): Observable<any> {

  const url =  `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DEPARTMENTS.ASSIGN}`;

  return this.http.request(HTTP_METHOD.POST, url, {
    observeResponse: true,
    body: payload
  });
}

  /** Get current department of an employee */
  getCurrentDepartment(employeeId: number | string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DEPARTMENTS.CURRENT(employeeId)}`,
      { observeResponse: true }
    );
  }

  /** Get full department history of an employee */
  getDepartmentHistory(employeeId: number | string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DEPARTMENTS.HISTORY(employeeId)}`,
      { observeResponse: true }
    );
  }
}
