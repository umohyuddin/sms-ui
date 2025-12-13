import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class ConcessionComponentManagementService {

  private baseUrl = '';

    constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  saveConcessionComponent(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;

    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  getConcessionComponentById(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }


getConcessionComponentsByTypeId(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.GET_BY_CONCESSION_TYPE(id)}`,
      { observeResponse: true }
    );
  }
  getAllConcessionComponent(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.GET_ALL}`, { observeResponse: true });
  }


  searchConcessionComponents(params: any): Observable<any> {
    console.log(this.baseUrl)
    console.log('🔗 Search URL:', this.baseUrl);
    console.log('📦 Params:', params);
    return this.http.request(HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.SEARCH}`,
      {
        observeResponse: true,
        params: params
      }
    );
  }

  // deleteCampus(id: number): Observable<any> {
  //   return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}/${id}`, { observeResponse: true });
  // }
}
