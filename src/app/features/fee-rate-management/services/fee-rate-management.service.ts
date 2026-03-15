import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class FeeRateManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService, private logger: LoggerService) {
    this.baseUrl = appConfig.apiBaseUrl;
    this.logger.info('API Base URL', this.appConfig.apiBaseUrl);
  }


  saveFeeRate(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate ? `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_RATES.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_RATES.CREATE}`;
    return this.http.request(method, url, { observeResponse: true, body: payload });
  }

  getAllFeeRates(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_RATES.GET_ALL}`, { observeResponse: true });
  }

  getFeeRateById(id: string): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_RATES.GET_BY_ID(id)}`, { observeResponse: true });
  }

  searchFeeRates(params: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_RATES.SEARCH}`, { observeResponse: true, params: params }
    );
  }

  getFeeSlabGroups(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_SLAB_GROUPS.GET_ALL}`, { observeResponse: true });
  }
}
