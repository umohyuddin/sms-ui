import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tenant } from '../../features/tenant-management/models/AcademicYearResponse';

@Injectable({
  providedIn: 'root'
})
export class TenantDataService {
private tenantSource = new BehaviorSubject<Tenant[]>([]);
tenants$ = this.tenantSource.asObservable();
  constructor() { }

  setTenants(tenants:Tenant[]){
    this.tenantSource.next(tenants);

  }
}
