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

getActiveFeeRates(paramsObj: any):Observable<any>{
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_RATES.GET_ACTIVE_RATES}`, { 
      params: paramsObj,
      observeResponse: true });
}

  // deleteCampus(id: number): Observable<any> {
  //   return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}/${id}`, { observeResponse: true });
  // }

}
