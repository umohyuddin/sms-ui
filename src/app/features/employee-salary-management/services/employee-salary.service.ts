import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable, of } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { EmployeeSalaryFullResponse } from '../models/EmployeeSalary';


@Injectable({
  providedIn: 'root'
})
export class EmployeeSalaryService {

  private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService
  ) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.baseUrl);
  }

  // -------------------------
  // GET ALL SALARIES
  // -------------------------
  getAllEmployeeSalaries(): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.EMPLOYEE_SALARY.GET_ALL}`,
      { observeResponse: true }
    );
  }

  // -------------------------
  // GET SALARY BY ID
  // -------------------------
  getEmployeeSalaryById(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.EMPLOYEE_SALARY.GET_BY_EMP_ID(id.toString())}`,
      { observeResponse: true }
    );
  }

  // -------------------------
  // GET SALARIES BY EMPLOYEE
  // -------------------------
  getSalariesByEmployee(employeeId: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.EMPLOYEE_SALARY.GET_BY_EMPLOYEE(employeeId.toString())}`,
      { observeResponse: true }
    );
  }

  // -------------------------
  // CREATE / UPDATE SALARY
  // -------------------------
  saveSalary(id: number | null, payload: EmployeeSalaryFullResponse): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.EMPLOYEE_SALARY.UPDATE(id.toString()!)}`
      : `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.EMPLOYEE_SALARY.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  // -------------------------
  // SOFT DELETE SALARY
  // -------------------------
  deleteSalary(id: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.DELETE,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.EMPLOYEE_SALARY.DELETE(id.toString())}`,
      { observeResponse: true }
    );
  }
}

