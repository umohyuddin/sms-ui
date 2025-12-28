import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTypeManagementRoutingModule } from './employee-type-management-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTypeListingComponent } from './pages/employee-type-listing/employee-type-listing.component';
import { EmployeeTypeDetailsComponent } from './pages/employee-type-details/employee-type-details.component';
import { EmployeeTypeCreateComponent } from './pages/employee-type-create/employee-type-create.component';


const routes: Routes = [
  { path: '', component: EmployeeTypeListingComponent },
  { path: 'employee-type-details/:id', component: EmployeeTypeDetailsComponent },
  { path: 'employee-type-edit/:id', component: EmployeeTypeCreateComponent },
  { path: 'employee-type-create', component: EmployeeTypeCreateComponent }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class EmployeeTypeManagementModule { }
