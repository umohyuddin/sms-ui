import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import { FailCriteria } from '../../models/institute/fail-criteria.model';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { createPayload } from '../../models/api-payload/create-payload.model';

@Injectable({
  providedIn: 'root'
})
export class FailCriteriaService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAll(): Observable<FailCriteria[]> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<FailCriteria>>(ApiConfig.getAllFailCriteria).pipe(
      map((res) => res.data.map((item) => item.attributes)),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch banks'));
      })
    );
  }
  getById(id: number): Observable<FailCriteria> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<FailCriteria>>(`${ApiConfig.getFailCriteriaById}/${id}`).pipe(
      map((res) => res.data[0].attributes),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch FailCriteria'));
      })
    );
  }
  
  getByInstitute(id: number): Observable<FailCriteria> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<FailCriteria>>(`${ApiConfig.getFailCriteriaByInstitute}/${id}`).pipe(
      map((res) => res.data[0].attributes),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch FailCriteria'));
      })
    );
  }
  
  create(pFailCriteria: FailCriteria): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(pFailCriteria);
    return this.http.post<ApiResponse<{ message: string }>>(ApiConfig.createFailCriteria, payLoad).pipe(
        map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to create FailCriteria'));
      })
    );
  }

  update(pFailCriteria: FailCriteria): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(pFailCriteria);
    return this.http.put<ApiResponse<{ message: string }>>(ApiConfig.updateFailCriteria, payLoad).pipe(
        map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to update FailCriteria'));
      })
    );
  }

  delete(pFailCriteria: FailCriteria): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.delete<ApiResponse<{ message: string }>>(`${ApiConfig.deleteFailCriteria}/${pFailCriteria.id}`).pipe(
        map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to delete FailCriteria'));
      })
    );
  }
}
