import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import { Campus } from '../../models/institute/campus.model';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { createPayload } from '../../models/api-payload/create-payload.model';

@Injectable({
  providedIn: 'root'
})
export class CampusService {

   constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAllCampus(): Observable<Campus[]> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<Campus>>(ApiConfig.getAllCampus).pipe(
      map((res) => res.data.map((item) => item.attributes)),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch Campuses'));
      })
    );
  }
  getCampusById(id: number): Observable<Campus> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<Campus>>(`${ApiConfig.getCampusById}/${id}`).pipe(
      map((res) => res.data[0].attributes),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch Campuse'));
      })
    );
  }
  
  createCampus(campus: Campus): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(campus);
    return this.http.post<ApiResponse<{ message: string }>>(ApiConfig.createCampus, payLoad).pipe(
       map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to create Campuse'));
      })
    );
  }

  updateCampus(campus: Campus): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(campus);
    return this.http.put<ApiResponse<{ message: string }>>(ApiConfig.updateCampus, payLoad).pipe(
       map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to update Campuse'));
      })
    );
  }

  deleteCampus(campus: Campus): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.delete<ApiResponse<{ message: string }>>(`${ApiConfig.deleteCampus}/${campus.id}`).pipe(
       map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to delete Campuse'));
      })
    );
  }
}
