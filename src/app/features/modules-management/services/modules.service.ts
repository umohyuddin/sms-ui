import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { JwtService } from '../../../core/services/jwt.service';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService,
    private jwtService: JwtService
  ) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getAllModules(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.GET_ALL}`;
    console.log('📍 API URL:', url);
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }

  getModuleById(id: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.GET_BY_ID(id)}`;
    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }

  saveModule(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  deleteModule(id: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.DELETE(id)}`;
    return this.http.request(
      HTTP_METHOD.DELETE,
      url,
      { observeResponse: true }
    );
  }

  searchModules(keyword: string): Observable<any> {
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.SEARCH(keyword)}`
      : `${this.baseUrl}${API_ENDPOINTS.USERS.MODULES.GET_ALL}`;

    console.log('🔍 Search URL:', url);

    return this.http.request(
      HTTP_METHOD.GET,
      url,
      { observeResponse: true }
    );
  }
}
