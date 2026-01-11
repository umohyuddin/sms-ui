import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { SalaryComponentListingComponent } from './pages/salary-component-listing/salary-component-listing.component';
import { SalaryComponentCreateComponent } from './pages/salary-component-create/salary-component-create.component';
import { SalaryComponentDetailsComponent } from './pages/salary-component-details/salary-component-details.component';

const routes: Routes = [
  { path: '', component: SalaryComponentListingComponent },
  { path: 'salary-component-details/:id', component: SalaryComponentDetailsComponent },
  { path: 'salary-component-create', component: SalaryComponentCreateComponent },
  { path: 'salary-component-edit/:id', component: SalaryComponentCreateComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SalaryComponentManagementModule { }
