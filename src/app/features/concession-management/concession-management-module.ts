import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConcessionListing } from './pages/concession-listing/concession-listing';
import { ConcessionCreate } from './pages/concession-create/concession-create';
import { ConcessionDetails } from './pages/concession-details/concession-details';


const routes: Routes = [
  { path: '', component: ConcessionListing },
  { path: 'concession-details/:id', component: ConcessionDetails },
  { path: 'concession-edit/:id', component: ConcessionCreate },
  { path: 'concession-create', component: ConcessionCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class ConcessionManagementModule { }
