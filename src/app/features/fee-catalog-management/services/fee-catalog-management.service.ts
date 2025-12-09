import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class FeeCatalogManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getFeeCatalogMeta():Observable<any>{
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_CATALOG_META}`, { observeResponse: true });   
  }
  getAllFeeCatalogs(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG.GET_ALL}`, { observeResponse: true });
  }

  getFeeCatalogById(id: string): Observable<any> {
    return this.http.request(
      HTTP_METHOD.GET,
      `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG.GET_BY_ID(id)}`,
      { observeResponse: true }
    );
  }


  saveFeeCatalog(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;

    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;

    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }
  searchFeeCatalogs(query: string): Observable<any> {
    const url = query
      ? `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG.SEARCH(query)}`
      : `${this.baseUrl}${API_ENDPOINTS.FEE.FEE_CATALOG.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  // deleteCampus(id: number): Observable<any> {
  //   return this.http.request(HTTP_METHOD.DELETE, `${this.baseUrl}/${id}`, { observeResponse: true });
  // }
}
