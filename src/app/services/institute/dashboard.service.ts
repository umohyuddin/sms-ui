import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { createPayload } from '../../models/api-payload/create-payload.model';
import { Dashboard } from '../../models/institute/dashboard.model';
import { DashboardPayload } from '../../models/institute/dashboard-payload.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

 constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getDashBoard(pDashboardPayload: DashboardPayload): Observable<Dashboard> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(pDashboardPayload);
    return this.http.post<ApiResponse<Dashboard>>(ApiConfig.getDashBoard, payLoad).pipe(
      map((res) => res.data[0]?.attributes),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch Campuses'));
      })
    );
  }
}
