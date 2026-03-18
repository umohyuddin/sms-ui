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
  }

  saveConcessionComponent(id: string | number | null, payload: any): Observable<any> {
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

  getConcessionComponentById(id: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }

  getConcessionComponentsByTypeId(id: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.GET_BY_CONCESSION_TYPE(id)}`,
      { observeResponse: true }
    );
  }

  getAllConcessionComponent(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.GET_ALL}`, { observeResponse: true });
  }

  searchConcessionComponents(discountTypeId?: string | number, keyword?: string): Observable<any> {
    return this.http.request(HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.SEARCH(discountTypeId, keyword)}`,
      { observeResponse: true }
    );
  }

  toggleActive(id: string | number, activate: boolean): Observable<any> {
    const endpoint = activate 
      ? API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.ACTIVATE(id) 
      : API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.DEACTIVATE(id);
    return this.http.request(HTTP_METHOD.PATCH, `${this.baseUrl}${endpoint}`, { observeResponse: true });
  }

  deleteConcessionComponent(id: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.DELETE,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_SUB_TYPE.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }
}
