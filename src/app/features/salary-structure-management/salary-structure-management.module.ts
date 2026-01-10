import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { SalaryStructureListingComponent } from './pages/salary-structure-listing/salary-structure-listing.component';
import { SalaryStructureCreateFormComponent } from './components/salary-structure-create-form/salary-structure-create-form.component';
import { SalaryStructureDetailsComponent } from './pages/salary-structure-details/salary-structure-details.component';
import { SalaryStructureCreateComponent } from './pages/salary-structure-create/salary-structure-create.component';


const routes: Routes = [
  { path: '', component: SalaryStructureListingComponent },
  { path: 'salary-structure-create', component: SalaryStructureCreateComponent },
  { path: 'salary-structure-edit/:id', component: SalaryStructureCreateComponent },
  { path: 'salary-structure-details/:id', component: SalaryStructureDetailsComponent }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class SalaryStructureManagementModule { }
