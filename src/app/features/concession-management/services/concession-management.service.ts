import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class ConcessionManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
  }

  getAllConcessions(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_TYPE.GET_ALL}`, { observeResponse: true });
  }

  getActiveConcessions(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_TYPE.GET_ACTIVE}`, { observeResponse: true });
  }

  getInactiveConcessions(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_TYPE.GET_INACTIVE}`, { observeResponse: true });
  }

  getConcessionById(id: string | number): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_TYPE.GET_BY_ID(id)}`, { observeResponse: true });
  }

  saveConcession(id: string | number | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_TYPE.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_TYPE.CREATE}`;
    return this.http.request(method, url, { observeResponse: true, body: payload });
  }

  searchDiscountTypes(query: string): Observable<any> {
    const url = query
      ? `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_TYPE.SEARCH(query)}`
      : `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_TYPE.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  deleteConcession(id: string | number): Observable<any> {
    return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_TYPE.GET_BY_ID(id)}`, { observeResponse: true });
  }
}
