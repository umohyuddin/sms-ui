import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CampusCreate } from './pages/campus-create/campus-create';
import { CampusDetails } from './pages/campus-details/campus-details';
import { CampusListing } from './pages/campus-listing/campus-listing';


const routes: Routes = [
  { path: '', component: CampusListing },
  { path: 'campus-details/:id', component: CampusDetails },
    { path: 'campus-edit/:id', component: CampusCreate },
  { path: 'campus-create', component: CampusCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class CampusManagementModule { }
