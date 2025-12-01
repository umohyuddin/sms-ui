import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';
import { CampusListing } from './pages/campus-listing/campus-listing';
import { CampusDetails } from './pages/campus-details/campus-details';
import { CampusCreate } from './pages/campus-create/campus-create';


const routes: Routes = [
  { path: '', component: CampusListing },
  { path: 'campus-details/:id', component: CampusDetails },
  { path: 'campus-create', component: CampusCreate },
   { path: 'campus-edit/:id', component: CampusCreate },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CampusManagementRoutingModule { }



