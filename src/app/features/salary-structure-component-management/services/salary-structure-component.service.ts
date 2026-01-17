import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable, of } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { SalaryStructureComponent } from '../models/SalaryStructureComponent';
import { ROUTES } from '../../../core/const/APP_ROUTES';

@Injectable({
  providedIn: 'root'
})
export class SalaryStructureComponentService {

  private baseUrl = '';

  // Static data based on provided API response
 

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }

  getSalaryStructureComponentMeta(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE_COMPONENT.GET_ALL}`, { observeResponse: true });
  }

  getAllSalaryStructureComponents(): Observable<any> {
     return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE.DETAIL}`, { observeResponse: true });
  }

  // getSalaryStructureComponentById(id: number): Observable<any> {
  //   const component = this.salaryStructureComponents.find(c => c.id === id);
  //   return of({ body: component });
  // }

  saveSalaryStructureComponent(id: string | null, payload: SalaryStructureComponent): Observable<any> {
    // For static data, this is a no-op. In real app, would make API call
    return of({ body: payload });
  }

  // searchSalaryStructureComponents(query: string): Observable<any> {
  //   const filtered = this.salaryStructureComponents.filter(c =>
  //     c.componentName.toLowerCase().includes(query.toLowerCase()) ||
  //     c.salaryStructureId.toString().includes(query)
  //   );
  //   return of({ body: filtered });
  // }

  // getSalaryStructureComponentsByStructureId(structureId: number): Observable<any> {
  //   const filtered = this.salaryStructureComponents.filter(c => c.salaryStructureId === structureId);
  //   return of({ body: filtered });
  // }

  createSalaryComponentMapping(payload: any): Observable<any> {
    return this.http.request(
      HTTP_METHOD.POST,
      `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE_COMPONENT.CREATE}`,
      { observeResponse: true, body: payload }
    );
  }
  updateSalaryComponentMapping(id:string,payload: any): Observable<any> {
    return this.http.request(
      HTTP_METHOD.PUT,
      `${this.baseUrl}${API_ENDPOINTS.SALARY_STRUCTURE_COMPONENT.UPDATE(id)}`,
      { observeResponse: true, body: payload }
    );
  }
}
