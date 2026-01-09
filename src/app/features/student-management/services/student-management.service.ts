import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }
getDocsMeta(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.EMPLOYEE_DOCS_META}`, { observeResponse: true });
  }

  uploadStudentDocs(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.STUDENTS.UPLOAD_DOCS}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  downloadStudentDocument(documentId: number, employeeId: string, fileName: string): void {
  const url = `${this.baseUrl}${API_ENDPOINTS.STUDENTS.DOWNLOAD_DOCS}/${documentId}?studentId=${employeeId}`;

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

    getStudentDocs(id: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.STUDENTS.GET_STUDENT_DOCS(id)}`, { observeResponse: true });
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
    const url = `${this.baseUrl}${API_ENDPOINTS.STUDENTS.STUDENT_FEE_PAYMENT}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  getCurrentAcademicYear(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_CURRENT}`, { observeResponse: true });
  }

  getAdmissionType(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ADMISSION_TYPES.GET_ALL}`, { observeResponse: true });
  }


  getAddmissionMeta(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.STUDENT_ADMISSION_META}`, { observeResponse: true });
  }

  getAllStudents(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.STUDENTS.GET_ALL}`, { observeResponse: true });
  }

  getStudentById(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.STUDENTS.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }

  searchStudents(params: any): Observable<any> {
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
  getAssignedStudentDiscounts(studentId:string,paramsObj: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.STUDENTS.STUDENT_ASSIGNED_DISCOUNT.GET_STUDENT_ASSIGNED_DISCOUNT(studentId)}`, {
      params: paramsObj,
      observeResponse: true
    });
  }

  getAssignedStudentFee(studentId:string,paramsObj: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.STUDENTS.STUDENT_ASSIGNED_FEE.GET_STUDENT_ASSIGNED_FEE_FLAT(studentId)}`, {
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
    updateStudentAssignFee(id: string, payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.STUDENTS.UPDATE_STUDENT_FEE(id)}`;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true,
      body: payload
    });
  }

  // deleteCampus(id: number): Observable<any> {
  //   return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}/${id}`, { observeResponse: true });
  // }

}
