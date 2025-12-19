import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Routes } from '@angular/router';
import { TenantListing } from './pages/tenant-listing/tenant-listing';
import { TenantDetails } from './pages/tenant-details/tenant-details';
import { TenantCreate } from './pages/tenant-create/tenant-create';

const routes: Routes = [
  { path: '', component: TenantListing },
  { path: 'tenant-details/:id', component: TenantDetails },
  { path: 'tenant-create', component: TenantCreate }

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class TenantManagementRoutingModule { }



