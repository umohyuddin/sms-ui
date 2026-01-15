import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalaryStructureComponentListingComponent } from './pages/salary-structure-component-listing/salary-structure-component-listing.component';
import { SalaryStructureComponentDetailsComponent } from './pages/salary-structure-component-details/salary-structure-component-details.component';
import { SalaryStructureComponentCreateComponent } from './pages/salary-structure-component-create/salary-structure-component-create.component';
import { AssignEmployeeSalaryComponent } from './pages/assign-employee-salary/assign-employee-salary.component';
// Import other components as needed
// import { SalaryStructureComponentDetailsComponent } from './pages/salary-structure-component-details/salary-structure-component-details.component';
// import { SalaryStructureComponentCreateComponent } from './pages/salary-structure-component-create/salary-structure-component-create.component';

const routes: Routes = [
  { path: '', component: SalaryStructureComponentListingComponent },
  { path: 'salary-structure-component-details/:id', component: SalaryStructureComponentDetailsComponent },
  { path: 'salary-structure-component-create', component: SalaryStructureComponentCreateComponent },
  { path: 'salary-structure-component-edit/:id', component: SalaryStructureComponentCreateComponent },
  { path: 'assing-employee-salary/:id', component: AssignEmployeeSalaryComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SalaryStructureComponentManagementRoutingModule { }
