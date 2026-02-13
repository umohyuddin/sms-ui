import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherAssignmentManagementRoutingModule } from './teacher-assignment-management-routing-module';
import { TeacherAssignmentListing } from './pages/teacher-assignment-listing/teacher-assignment-listing';
import { TeacherAssignmentForm } from './pages/teacher-assignment-form/teacher-assignment-form';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    TeacherAssignmentManagementRoutingModule,
    FormsModule
  ]
})
export class TeacherAssignmentManagementModule { }
