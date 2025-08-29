import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import { User} from '../../models/user/user.model';
import {ApiResponse } from '../../models/api-response/api-response.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getUsers(): Observable<User[]> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<User>>(ApiConfig.getUsers).pipe(
      map((res) => res.data.map((item) => item.attributes)),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch users'));
      })
    );
  }
}