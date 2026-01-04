import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { SalaryStructureListingComponent } from './pages/salary-structure-listing/salary-structure-listing.component';
import { SalaryComponentCreateFormComponent } from '../salary-component-management/components/salary-component-create-form/salary-component-create-form.component';
import { SalaryComponentDetailsComponent } from '../salary-component-management/pages/salary-component-details/salary-component-details.component';


const routes: Routes = [
  { path: '', component: SalaryStructureListingComponent },
  { path: 'salary-structure-create', component: SalaryComponentCreateFormComponent },
  { path: 'salary-structure-edit/:id', component: SalaryComponentCreateFormComponent },
  { path: 'salary-structure-details', component: SalaryComponentDetailsComponent }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class SalaryStructureManagementModule { }
