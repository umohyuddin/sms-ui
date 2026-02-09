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
export class DashboardManagementService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService, private logger: LoggerService) {
    this.baseUrl = appConfig.apiBaseUrl;
    this.logger.info('API Base URL', this.appConfig.apiBaseUrl);
  }

  getStudentDashboardCounts(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DASHBOARD.GET_STUDENT_COUNTS}`, { observeResponse: true });
  }

    getDashboardCounts(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DASHBOARD.GET_DASHBOARD_COUNTS}`, { observeResponse: true });
  }

   getDashboardFinancials(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.DASHBOARD.GET_DASHBOARD_FINANCIAL}`, { observeResponse: true });
  }
  getEmployeeCountByType(): Observable<any> {
  return this.http.request(
    HTTP_METHOD.GET,
    `${this.baseUrl}${API_ENDPOINTS.DASHBOARD.GET_EMPLOYEE_COUNT_BY_TYPE}`,
    { observeResponse: true }
  );
}

}
