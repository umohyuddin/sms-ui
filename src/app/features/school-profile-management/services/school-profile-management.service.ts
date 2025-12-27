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

}