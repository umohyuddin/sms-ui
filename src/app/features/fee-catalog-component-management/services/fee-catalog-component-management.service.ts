import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class FeeCatalogComponentManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }


  saveFeeCatalogComponent(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate ? `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG_COMPONENT.UPDATE(id)}` : `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG_COMPONENT.CREATE}`;
    return this.http.request(method, url, { observeResponse: true, body: payload });
  }

  getAllFeeCatalogComponents(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG_COMPONENT.GET_ALL}`, { observeResponse: true });
  }

  getFeeCatalogComponentsById(id: string): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG_COMPONENT.GET_BY_ID(id)}`, { observeResponse: true });
  }

  getByFeeCatalogId(id: string): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG_COMPONENT.GET_BY_FEE_CATALOG(id)}`, { observeResponse: true });
  }

  searchFeeCatalogComponents(params: any): Observable<any> {
    return this.http.request(HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG_COMPONENT.SEARCH}`,
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
