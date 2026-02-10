import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SubjectListing } from './pages/subject-listing/subject-listing';
import { SubjectCreate } from './pages/subject-create/subject-create';
import { SubjectDetails } from './pages/subject-details/subject-details';

const routes: Routes = [
  { path: '', component: SubjectListing },
  { path: 'subject-details/:id', component: SubjectDetails },
  { path: 'subject-edit/:id', component: SubjectCreate },
  { path: 'subject-create', component: SubjectCreate }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SubjectManagementModule { }
