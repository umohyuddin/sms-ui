import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { Observable } from 'rxjs';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = '';

  constructor(private http: HttpClientService, private appConfig: AppConfigService) {
    this.baseUrl = appConfig.apiBaseUrl;
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
  }


  loginUser( payload: any): Observable<any> {
      let url =  `${this.baseUrl}${API_ENDPOINTS.AUTH.CREATE}`;

    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }
 logout() {
    // Remove JWT token
    localStorage.removeItem('auth_token');
    
    // Remove user info if saved
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('menus');

  }
  
}
