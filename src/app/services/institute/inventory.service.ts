import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfig } from '../../config/api.config';
import { ApiResponse } from '../../models/api-response/api-response.model';
import { Inventory } from '../../models/institute/inventory.model';
import { createPayload } from '../../models/api-payload/create-payload.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAllInventory(): Observable<Inventory[]> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get<ApiResponse<Inventory>>(ApiConfig.getAllInventory).pipe(
      map((res) => res.data.map((item) => item.attributes)),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to fetch Inventory'));
      })
    );
  }

  createInventory(pInventory: Inventory): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(pInventory);
    return this.http.post<ApiResponse<{ message: string }>>(ApiConfig.createInventory, payLoad).pipe(
       map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to create Inventory'));
      })
    );
  }

  updateInventory(pInventory: Inventory): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const payLoad = createPayload(pInventory);
    return this.http.put<ApiResponse<{ message: string }>>(ApiConfig.updateInventory, payLoad).pipe(
       map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to update Inventory'));
      })
    );
  }

  deleteInventory(pInventory: Inventory): Observable<String> {
    if (!this.authService.isAuthenticated() && isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.delete<ApiResponse<{ message: string }>>(`${ApiConfig.deleteInventory}/${pInventory.inventoryId}`).pipe(
       map((res) => res.data[0].attributes.message ),
      catchError((error) => {
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          this.authService.logout();
        }
        return throwError(() => new Error(error.error?.message || 'Failed to delete Inventory'));
      })
    );
  }
}
