import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import {ApiResponse } from '../../models/api-response/api-response.model';
import { EmployeeRole } from '../../models/employee/employee-role.modelinterface';
import { createPayload } from '../../models/api-payload/create-payload.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRoleService {

   constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAllEmployeeRole(): Observable<EmployeeRole[]> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<EmployeeRole>>(ApiConfig.getAllEmployeeRole).pipe(
      map((res) => res.data.map((item) => item.attributes)),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch EmployeeRole'));
      })
    );
  }
  createEmployeeRole(pEmployeeRole: EmployeeRole): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(pEmployeeRole);
    return this.http.post<ApiResponse<{ message: string }>>(ApiConfig.createEmployeeRole, payLoad).pipe(
        map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to create Employee Role'));
      })
    );
  }

updateEmployeeRole(pEmployeeRole: EmployeeRole): Observable<String> {
  if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
    return throwError(() => new Error('User is not authenticated'));
  }
  const payLoad = createPayload(pEmployeeRole);
  return this.http.put<ApiResponse<{ message: string }>>(ApiConfig.updateEmployeeRole, payLoad).pipe(
      map((res) => res.data[0].attributes.message ),
    catchError((error) => {
      if (error.status === 401 && isPlatformBrowser(this.platformId)) {
        this.authService.logout();
      }
      return throwError(() => new Error(error.error?.message || 'Failed to update Employee Role'));
    })
  );
}

deleteEmployeeRole(pEmployeeRole: EmployeeRole): Observable<String> {
  if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
    return throwError(() => new Error('User is not authenticated'));
  }
  return this.http.delete<ApiResponse<{ message: string }>>(`${ApiConfig.deleteEmployeeRole}/${pEmployeeRole.id}`).pipe(
      map((res) => res.data[0].attributes.message ),
    catchError((error) => {
      if (error.status === 401 && isPlatformBrowser(this.platformId)) {
        this.authService.logout();
      }
      return throwError(() => new Error(error.error?.message || 'Failed to delete Employee Role'));
    })
  );
}
}
