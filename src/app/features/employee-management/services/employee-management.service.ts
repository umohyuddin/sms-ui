import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }


  save(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;

    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.STUDENTS.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.STUDENTS.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  saveFeePaymente(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.GET_ALL}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  uploadProfilePhoto(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.UPDATE_PROFILE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }


  uploadEmployeeDocs(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.UPLOAD_DOCS}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  getCurrentAcademicYear(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_CURRENT}`, { observeResponse: true });
  }

  getDocsMeta(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.EMPLOYEE_DOCS_META}`, { observeResponse: true });
  }

  getAdmissionType(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.GET_ALL}`, { observeResponse: true });
  }


  getAddmissionMeta(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.STUDENT_ADMISSION_META}`, { observeResponse: true });
  }

  getAllEmployee(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.GET_ALL}`, { observeResponse: true });
  }

  getEmployeeById(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }

  searchEmployee(params: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.STUDENTS.SEARCH}`,
      {
        observeResponse: true,
        params: params
      }
    );
  }

  getStudentFeeSummary(params: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.STUDENTS.STUDENT_FEE_SUMMARY}`,
      {
        observeResponse: true,
        params: params
      }
    );
  }

  getActiveFeeRates(paramsObj: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_RATES.GET_ACTIVE_RATES}`, {
      params: paramsObj,
      observeResponse: true
    });
  }

  getActiveDiscounts(paramsObj: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_RATES.GET_ACTIVE_DISCOUNTS}`, {
      params: paramsObj,
      observeResponse: true
    });
  }


  studentAssignFee(id: string, payload: any): Observable<any> {


    const url = `${this.baseUrl}${API_ENDPOINTS.STUDENTS.ASSIGN_STUDENT_FEE(id)}`;

    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  // deleteCampus(id: number): Observable<any> {
  //   return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}/${id}`, { observeResponse: true });
  // }

}
