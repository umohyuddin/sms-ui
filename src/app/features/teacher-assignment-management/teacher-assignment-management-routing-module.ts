import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TeacherAssignmentListing } from './pages/teacher-assignment-listing/teacher-assignment-listing';
import { TeacherAssignmentForm } from './pages/teacher-assignment-form/teacher-assignment-form';

const routes: Routes = [
  { path: '', component: TeacherAssignmentListing },
  { path: 'create', component: TeacherAssignmentForm },
  { path: 'edit/:id', component: TeacherAssignmentForm }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TeacherAssignmentManagementRoutingModule { }
