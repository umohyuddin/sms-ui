import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDeductionListingComponent } from './pages/employee-deduction-listing/employee-deduction-listing.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeDeductionListingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeDeductionManagementRoutingModule { }
