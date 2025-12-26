import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { DesignationListingComponent } from './pages/designation-listing/designation-listing.component';
import { DesignationDetailsComponent } from './pages/designation-details/designation-details.component';
import { DesignationCreateComponent } from './pages/designation-create/designation-create.component';


const routes: Routes = [
  { path: '', component: DesignationListingComponent },
  { path: 'designation-details/:id', component: DesignationDetailsComponent },
  { path: 'designation-edit/:id', component: DesignationCreateComponent },
  { path: 'designation-create', component: DesignationCreateComponent }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)
  ]
})
export class DesignationManagementModule { }
