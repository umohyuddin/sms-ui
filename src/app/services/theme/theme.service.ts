import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import { UserRole} from '../../models/user/user-role.model';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { createPayload } from '../../models/api-payload/create-payload.model';
import { Theme } from '../../models/theme/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
   constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getThemeByUserId(id: number): Observable<Theme> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<Theme>>(`${ApiConfig.getThemeByUserId}/${id}`).pipe(
      map((res) => res.data[0].attributes),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        console.log(error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch Theme'));
      })
    );
  }

  create(pTheme: Theme): Observable<string> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(pTheme);
    console.log(payLoad);
    return this.http.post<ApiResponse<{ message: string }>>(ApiConfig.createTheme, payLoad).pipe(
      map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to create Theme'));
      })
    );
  }

  update(pTheme: Theme): Observable<string> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(pTheme);
    console.log(payLoad);
    return this.http.put<ApiResponse<{ message: string }>>(ApiConfig.updateTheme, payLoad).pipe(
      map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to update Theme'));
      })
    );
  }

  delete(pTheme: Theme): Observable<string> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
  
    return this.http.delete<ApiResponse<{ message: string }>>(`${ApiConfig.deleteTheme}/${pTheme.id}`).pipe(
      map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to delete Theme'));
      })
    );
  }

}
