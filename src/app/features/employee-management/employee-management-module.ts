import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListing } from './pages/employee-listing/employee-listing';
import { EmployeeDetails } from './pages/employee-details/employee-details';
import { EmployeeCreate } from './pages/employee-create/employee-create';


const routes: Routes = [
  { path: '', component: EmployeeListing },
  { path: 'employee-details/:id', component: EmployeeDetails },
  { path: 'employee-edit/:id', component: EmployeeCreate },
  { path: 'employee-create', component: EmployeeCreate },
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class EmployeeManagementModule { }
