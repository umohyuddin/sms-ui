import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StandardListing } from './pages/standard-listing/standard-listing';
import { StandardDetails } from './pages/standard-details/standard-details';
import { StandardCreate } from './pages/standard-create/standard-create';


const routes: Routes = [
  { path: '', component: StandardListing },
  { path: 'standard-details/:id', component: StandardDetails },
  { path: 'standard-edit/:id', component: StandardCreate },
  { path: 'standard-create', component: StandardCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class StandardManagementModule { }
