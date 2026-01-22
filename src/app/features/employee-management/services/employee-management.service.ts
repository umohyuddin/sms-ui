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

  save(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.CREATE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true, body: payload
    });
  }



  update(payload: any, id: string): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.UPDATE(id)}`;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true, body: payload
    });
  }

  saveAddress(payload: any, id: string): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.ADDRESS.CREATE(id)}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true, body: payload
    });
  }

  updateAddress(payload: any, id: string): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.ADDRESS.UPDATE(id)}`;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true, body: payload
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


  getEmployeeDocs(id: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.GET_EMPLOYEE_DOCS(id)}`, { observeResponse: true });
  }

  getEmployeeAddressById(id: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.ADDRESS.GET_BY_ID(id)}`, { observeResponse: true });

  }
  getCurrentAcademicYear(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_CURRENT}`, { observeResponse: true });
  }

  getDocsMeta(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.EMPLOYEE_DOCS_META}`, { observeResponse: true });
  }

  getProvinceByCountryId(id: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.PROVINCE.GET_BY_COUNTRY_ID(id)}`, { observeResponse: true });
  }


  downloadEmployeeDocument(documentId: number, employeeId: string, fileName: string): void {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DOWNLOAD_DOCS}/${documentId}?employeeId=${employeeId}`;

    // Cast the request to Observable<Blob>
    (this.http.request('GET', url, { responseType: 'blob' } as any) as Observable<Blob>)
      .subscribe({
        next: (blob) => {
          const link = document.createElement('a');
          const objectUrl = window.URL.createObjectURL(blob);
          link.href = objectUrl;
          link.download = fileName || `document_${documentId}`;
          link.click();
          window.URL.revokeObjectURL(objectUrl);
        },
        error: (err) => console.error('Error downloading document', err)
      });
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

  getEmployeeAddress(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.ADDRESS.GET_EMPLOYEE_ID(id)}`,
      { observeResponse: true }
    );
  }


  searchEmployee(query: string): Observable<any> {
    const url = query ? `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.SEARCH(query)}` : `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  createEmployeeSalary(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.EMPLOYEE_SALARY.CREATE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  getEmployeeDepartment(employeeId: string): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DEPARTMENTS.CURRENT(employeeId)}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }
  getEmployeeDesignation(employeeId: string): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DESIGNATIONS.CURRENT(employeeId)}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  getEmployeeDepartmentHistory(employeeId: string): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DEPARTMENTS.HISTORY(employeeId)}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  getEmployeeDesignationHistory(employeeId: string): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.EMPLOYEE.DEPARTMENTS.HISTORY(employeeId)}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }
}
