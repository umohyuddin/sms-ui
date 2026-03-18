import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class ConcessionRateManagementService {
  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
  }

  saveConcessionRate(id: string | number | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_RATES.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_RATES.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  getConcessionRateById(id: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_RATES.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }

  getAllConcessionRates(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_RATES.GET_ALL}`, { observeResponse: true });
  }

  search(params: any): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_RATES.GET_ALL}/search`,
      { observeResponse: true, params }
    );
  }

  toggleActive(id: string | number, activate: boolean): Observable<any> {
    const endpoint = activate 
      ? API_ENDPOINTS.DISCOUNT.DISCOUNT_RATES.ACTIVATE(id) 
      : API_ENDPOINTS.DISCOUNT.DISCOUNT_RATES.DEACTIVATE(id);
    return this.http.request(HTTP_METHOD.PATCH, `${this.baseUrl}${endpoint}`, { observeResponse: true });
  }

  deleteConcessionRate(id: string | number): Observable<any> {
    return this.http.request(
      HTTP_METHOD.DELETE,
      `${this.baseUrl}${API_ENDPOINTS.DISCOUNT.DISCOUNT_RATES.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }
}
