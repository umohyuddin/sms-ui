import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolProfileManagementRoutingModule } from './school-profile-management-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { SchoolProfileListingTableComponent } from './components/school-profile-listing-table/school-profile-listing-table.component';
import { SchoolProfileInfoComponent } from './components/school-profile-info/school-profile-info.component';
import { SchoolProfileCreateFormComponent } from './components/school-profile-create-form/school-profile-create-form.component';
import { SchoolProfileListingComponent } from './pages/school-profile-listing/school-profile-listing.component';
import { SchoolProfileCreateComponent } from './pages/school-profile-create/school-profile-create.component';
const routes: Routes = [
  { path: '', component: SchoolProfileListingComponent },
  { path: 'profile-details/:id', component: SchoolProfileInfoComponent },
  { path: 'profile-create', component: SchoolProfileCreateComponent }

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class SchoolProfileManagementModule { }
