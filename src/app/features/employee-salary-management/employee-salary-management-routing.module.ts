import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeSalaryListingComponent } from './pages/employee-salary-listing/employee-salary-listing.component';
// Import other components as needed
// import { EmployeeSalaryDetailsComponent } from './pages/employee-salary-details/employee-salary-details.component';
// import { EmployeeSalaryCreateComponent } from './pages/employee-salary-create/employee-salary-create.component';

const routes: Routes = [
  { path: '', component: EmployeeSalaryListingComponent },
  // { path: 'employee-salary-details/:id', component: EmployeeSalaryDetailsComponent },
  // { path: 'employee-salary-create', component: EmployeeSalaryCreateComponent },
  // { path: 'employee-salary-edit/:id', component: EmployeeSalaryCreateComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EmployeeSalaryManagementRoutingModule { }
