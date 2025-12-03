import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

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
