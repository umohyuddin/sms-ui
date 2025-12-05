import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConcessionRateListing } from './pages/concession-rate-listing/concession-rate-listing';
import { ConcessionRateDetails } from './pages/concession-rate-details/concession-rate-details';
import { ConcessionRateCreate } from './pages/concession-rate-create/concession-rate-create';




const routes: Routes = [
  { path: '', component: ConcessionRateListing },
  { path: 'concession-rate-details/:id', component: ConcessionRateDetails },
  { path: 'concession-rate-edit/:id', component: ConcessionRateCreate },
  { path: 'concession-rate-create', component: ConcessionRateCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class ConcessionRateManagementModule { }
