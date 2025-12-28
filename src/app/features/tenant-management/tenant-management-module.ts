import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TenantListing } from './pages/tenant-listing/tenant-listing';
import { TenantDetails } from './pages/tenant-details/tenant-details';
import { TenantCreate } from './pages/tenant-create/tenant-create';

const routes: Routes = [
  { path: '', component: TenantListing },
  { path: 'academic-year-details/:id', component: TenantDetails },
  { path: 'academic-year-create', component: TenantCreate },
  { path: 'academic-year-edit/:id', component: TenantCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class TenantManagementModule { }
