import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


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
