import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConcessionListing } from './pages/concession-component-listing/concession-component-listing';
import { ConcessionComponentCreate } from './pages/concession-component-create/concession-component-create';
import { ConcessionComponentDetails } from './pages/concession-component-details/concession-component-details';


const routes: Routes = [
  { path: '', component: ConcessionListing },
  { path: 'concession-component-details/:id', component: ConcessionComponentDetails },
  { path: 'concession-component-edit/:id', component: ConcessionComponentCreate },
  { path: 'concession-component-create', component: ConcessionComponentCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class ConcessionComponentManagementModule { }
