import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { AppConfigService } from '../../../core/services/app-config.service';
import { HttpClientService } from '../../../core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolProfileManagementService {

private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService
  ) {
    this.baseUrl = this.appConfig.apiBaseUrl;
    console.log('API Base URL:', this.baseUrl);
  }

  getInstitute(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.PROFILE.GET}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  updateInstitute(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.PROFILE.UPDATE}`;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true,
      body: payload
    });
  }
  getCurrentAcademicYear(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_CURRENT}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getProvincesByCountryId(countryId: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.LOOKUP.PROVINCE.GET_BY_COUNTRY_ID(countryId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getCitiesByProvinceId(provinceId: number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CITY.GET_BY_PROVINCE_ID(provinceId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  createInstituteContact(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.CREATE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  updateInstituteContact(id: string | number, payload: any, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.UPDATE(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true,
      body: payload
    });
  }

  getInstituteContacts(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteContactsByInstituteId(instituteId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.GET_BY_INSTITUTE_ID(instituteId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteContactById(id: string | number, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.GET_BY_ID(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  deleteInstituteContact(id: string | number, organizationId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.DELETE(id)}`;
    const url = organizationId ? `${baseUrl}?organizationId=${organizationId}` : baseUrl;
    return this.http.request(HTTP_METHOD.DELETE, url, {
      observeResponse: true
    });
  }

  searchInstituteContacts(keyword: string): Observable<any> {
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.SEARCH(keyword)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.GET_ALL}`;

    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

}