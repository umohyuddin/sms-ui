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
    console.log('API Base URL:', this.baseUrl);
  }

  // ====================================
  // CREATE OR UPDATE FEE COMPONENT
  // ====================================
  saveFeeCatalogComponent(id: string | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate
      ? `${this.baseUrl}/api/fee/components/${id}`
      : `${this.baseUrl}/api/fee/components`;
    return this.http.request(method, url, { observeResponse: true, body: payload });
  }

  // ====================================
  // GET ALL COMPONENTS
  // ====================================
  getAllFeeCatalogComponents(): Observable<any> {
    const url = `${this.baseUrl}/api/fee/components`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  // ====================================
  // GET COMPONENT BY ID
  // ====================================
  getFeeCatalogComponentById(id: string): Observable<any> {
    const url = `${this.baseUrl}/api/fee/components/${id}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  // ====================================
  // GET COMPONENTS BY FEE CATALOG
  // ====================================
  getFeeCatalogComponentsByCatalogId(catalogId: string): Observable<any> {
    const url = `${this.baseUrl}/api/fee/components/catalog/${catalogId}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  // ====================================
  // SEARCH COMPONENTS
  // ====================================
  searchFeeCatalogComponents(feeCatalogId?: string, keyword?: string): Observable<any> {
    const url = `${this.baseUrl}/api/fee/components/search`;
    const params: any = {};
    if (feeCatalogId) params.feeCatalogId = feeCatalogId;
    if (keyword) params.keyword = keyword;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true, params });
  }

  // ====================================
  // DELETE COMPONENT (Optional)
  // ====================================
  deleteFeeCatalogComponent(id: string): Observable<any> {
    const url = `${this.baseUrl}/api/fee/components/${id}`;
    return this.http.request(HTTP_METHOD.DELETE, url, { observeResponse: true });
  }
}
