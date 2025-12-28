import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FeeRateCreate } from '../fee-rate-management/pages/fee-rate-create/fee-rate-create';
import { FeeRateDetails } from '../fee-rate-management/pages/fee-rate-details/fee-rate-details';
import { SalaryStructureListingComponent } from './pages/salary-structure-listing/salary-structure-listing.component';


const routes: Routes = [
  { path: '', component: SalaryStructureListingComponent },
  { path: 'fee-rate-details/:id', component: FeeRateDetails },
  { path: 'fee-rate-edit/:id', component: FeeRateCreate },
  { path: 'fee-rate-create', component: FeeRateCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class SalaryStructureManagementModule { }
