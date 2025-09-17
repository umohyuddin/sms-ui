import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../../config/api.config';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
   
  ) {}
  

  login(email: string, password: string): Observable<any> {
    return this.http.post(ApiConfig.generateToken, { email, password });
  }

  saveToken(token: string) {
      this.globalService.setToken(token);
      
  }

  getToken(): string | null {
    return this.globalService.getToken();
  }

  isAuthenticated(): boolean {
      const token = this.getToken();
      return !!token;
  }

  logout() {
    this.globalService.removeData();
  }

  callSecureApi(endpoint: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${endpoint}`, { headers });
  }
}
