import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SubjectGroupListing } from './pages/subject-group-listing/subject-group-listing';
import { SubjectGroupCreate } from './pages/subject-group-create/subject-group-create';
import { SubjectGroupDetails } from './pages/subject-group-details/subject-group-details';

const routes: Routes = [
  { path: '', component: SubjectGroupListing },
  { path: 'subject-group-details/:id', component: SubjectGroupDetails },
  { path: 'subject-group-edit/:id', component: SubjectGroupCreate },
  { path: 'subject-group-create', component: SubjectGroupCreate }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SubjectGroupManagementModule { }
