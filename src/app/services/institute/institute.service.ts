import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import { Institute} from '../../models/institute/institute.model';
import {ApiResponse } from '../../models/api-response/api-response.model';
import { createPayload } from '../../models/api-payload/create-payload.model';
@Injectable({
  providedIn: 'root'
})
export class InstituteService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAllInstitute(): Observable<Institute[]> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<Institute>>(ApiConfig.getAllInstitutes).pipe(
      map((res) => res.data.map((item) => item.attributes)),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch institute'));
      })
    );
  }

  getIstituteById(id: number): Observable<Institute> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<Institute>>(`${ApiConfig.getInstituteById}/${id}`).pipe(
      map((res) =>  res.data[0].attributes),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch institute'));
      })
    );
  }

  createIstitute(institute: Institute): Observable<string> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(institute);
    return this.http.post<ApiResponse<{ message: string }>>(ApiConfig.createInstitute,payLoad).pipe(
       map((res) => res.data[0].attributes.message),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to create institute'));
      })
    );
  }
  
  updateIstitute(institute: Institute): Observable<string> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(institute);
    return this.http.put<ApiResponse<{ message: string }>>(ApiConfig.updateInstitute, payLoad).pipe(
      map((res) => res.data[0].attributes.message),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to update institute'));
      })
    );
  }

  deleteIstitute(institute: Institute): Observable<string> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.delete<ApiResponse<{ message: string }>>(`${ApiConfig.deleteInstitute}/${institute.id}`).pipe(
      map((res) => res.data[0].attributes.message),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to delete institute'));
      })
    );
  }
}
