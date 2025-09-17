import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import {ApiResponse } from '../../models/api-response/api-response.model';
import { Employee } from '../../models/employee/employee.model';
import { createPayload } from '../../models/api-payload/create-payload.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

 constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAllEmployee(): Observable<Employee[]> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<Employee>>(ApiConfig.getAllEmployee).pipe(
      map((res) => res.data.map((item) => item.attributes)),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch Employee'));
      })
    );
  }

  createEmployee(pEmployee: Employee): Observable<String> {
      if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
        return throwError(() => new Error('User is not authenticated'));
      }
      const payLoad = createPayload(pEmployee);
      return this.http.post<ApiResponse<{ message: string }>>(ApiConfig.createEmployee, payLoad).pipe(
         map((res) => res.data[0].attributes.message ),
        catchError((error) => {
          if (error.status === 401 && isPlatformBrowser(this.platformId)) {
            this.authService.logout();
          }
          return throwError(() => new Error(error.error?.message || 'Failed to create Employee'));
        })
      );
    }
  
    updateEmployee(pEmployee: Employee): Observable<String> {
      if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
        return throwError(() => new Error('User is not authenticated'));
      }
      const payLoad = createPayload(pEmployee);
      return this.http.put<ApiResponse<{ message: string }>>(ApiConfig.updateEmployee, payLoad).pipe(
         map((res) => res.data[0].attributes.message ),
        catchError((error) => {
          if (error.status === 401 && isPlatformBrowser(this.platformId)) {
            this.authService.logout();
          }
          return throwError(() => new Error(error.error?.message || 'Failed to update Employee'));
        })
      );
    }
  
    deleteEmployee(pEmployee: Employee): Observable<String> {
      if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
        return throwError(() => new Error('User is not authenticated'));
      }
      return this.http.delete<ApiResponse<{ message: string }>>(`${ApiConfig.deleteEmployee}/${pEmployee.id}`).pipe(
         map((res) => res.data[0].attributes.message ),
        catchError((error) => {
          if (error.status === 401 && isPlatformBrowser(this.platformId)) {
            this.authService.logout();
          }
          return throwError(() => new Error(error.error?.message || 'Failed to delete Employee'));
        })
      );
    }
}
