import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SectionListing } from './pages/section-listing/section-listing';
import { SectionDetails } from './pages/section-details/section-details';
import { SectionCreate } from './pages/section-create/section-create';

const routes: Routes = [
  { path: '', component: SectionListing },
  { path: 'section-details/:id', component: SectionDetails },
  { path: 'section-edit/:id', component: SectionCreate },
  { path: 'section-create', component: SectionCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class SectionManagementModule { }
