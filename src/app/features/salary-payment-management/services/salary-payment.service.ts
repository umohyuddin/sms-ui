import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';

@Injectable({
  providedIn: 'root'
})
export class SalaryPaymentService {

  private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService
  ) {
    this.baseUrl = appConfig.apiBaseUrl;
  }

  // -------------------------
  // CREATE PAYMENT
  // -------------------------
  createPayment(payload: any): Observable<any> {
    return this.http.request(
      HTTP_METHOD.POST,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.SALARY_PAYMENT.CREATE}`,
      {
        observeResponse: true,
        body: payload
      }
    );
  }

  // -------------------------
  // UPDATE PAYMENT
  // -------------------------
  updatePayment(id: number, payload: any): Observable<any> {
    return this.http.request(
      HTTP_METHOD.PUT,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.SALARY_PAYMENT.UPDATE(id.toString())}`,
      {
        observeResponse: true,
        body: payload
      }
    );
  }

  // -------------------------
  // GET PAYMENT BY ID
  // -------------------------
  getPaymentById(id: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.SALARY_PAYMENT.GET_BY_ID(id.toString())}`,
      { observeResponse: true }
    );
  }

  // -------------------------
  // GET ALL PAYMENTS
  // -------------------------
  getAllPayments(): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.SALARY_PAYMENT.GET_ALL}`,
      { observeResponse: true }
    );
  }

  // -------------------------
  // GET PAYMENTS BY EMPLOYEE SALARY
  // -------------------------
  getPaymentsByEmployeeSalary(employeeSalaryId: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.SALARY_PAYMENT.GET_BY_EMPLOYEE_SALARY(employeeSalaryId.toString())}`,
      { observeResponse: true }
    );
  }
  getPaymentsByEmployeeId(employeeId: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.SALARY_PAYMENT.GET_BY_EMPLOYEE_ID(employeeId.toString())}`,
      { observeResponse: true }
    );
  }

  // -------------------------
  // SOFT DELETE PAYMENT
  // -------------------------
  deletePayment(id: number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.DELETE,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.SALARY_PAYMENT.DELETE(id.toString())}`,
      { observeResponse: true }
    );
  }
}
