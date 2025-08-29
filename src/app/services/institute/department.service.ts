import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import { Department} from '../../models/institute/department.modelinterface';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { createPayload } from '../../models/api-payload/create-payload.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

   constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAllDeparments(): Observable<Department[]> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<Department>>(ApiConfig.getAllDeparments).pipe(
      map((res) => res.data.map((item) => item.attributes)),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch Department'));
      })
    );
  }

  createDeparment(pDepartment: Department): Observable<String> {
      if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
        return throwError(() => new Error('User is not authenticated'));
      }
      const payLoad = createPayload(pDepartment);
      return this.http.post<ApiResponse<{ message: string }>>(ApiConfig.createDeparment, payLoad).pipe(
         map((res) => res.data[0].attributes.message ),
        catchError((error) => {
          if (error.status === 401 && isPlatformBrowser(this.platformId)) {
            this.authService.logout();
          }
          return throwError(() => new Error(error.error?.message || 'Failed to create Department'));
        })
      );
    }
  
    updateDeparment(pDepartment: Department): Observable<String> {
      if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
        return throwError(() => new Error('User is not authenticated'));
      }
      const payLoad = createPayload(pDepartment);
      return this.http.put<ApiResponse<{ message: string }>>(ApiConfig.updateDeparment, payLoad).pipe(
         map((res) => res.data[0].attributes.message ),
        catchError((error) => {
          if (error.status === 401 && isPlatformBrowser(this.platformId)) {
            this.authService.logout();
          }
          return throwError(() => new Error(error.error?.message || 'Failed to update Department'));
        })
      );
    }
  
    deleteDeparment(pDepartment: Department): Observable<String> {
      if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
        return throwError(() => new Error('User is not authenticated'));
      }
      return this.http.delete<ApiResponse<{ message: string }>>(`${ApiConfig.deleteDeparment}/${pDepartment.departmentId}`).pipe(
         map((res) => res.data[0].attributes.message ),
        catchError((error) => {
          if (error.status === 401 && isPlatformBrowser(this.platformId)) {
            this.authService.logout();
          }
          return throwError(() => new Error(error.error?.message || 'Failed to delete Department'));
        })
      );
    }
}
