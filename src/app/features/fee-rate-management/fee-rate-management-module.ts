import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FeeRateListing } from './pages/fee-rate-listing/fee-rate-listing';
import { FeeRateDetails } from './pages/fee-rate-details/fee-rate-details';
import { FeeRateCreate } from './pages/fee-rate-create/fee-rate-create';


const routes: Routes = [
  { path: '', component: FeeRateListing },
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
export class FeeRateManagementModule { }
