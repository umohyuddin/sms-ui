import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StudentAttendanceListing } from './pages/student-attendance-listing/student-attendance-listing';
import { StudentAttendanceMarking } from './pages/student-attendance-marking/student-attendance-marking';

const routes: Routes = [
  { path: '', component: StudentAttendanceListing },
  { path: 'mark', component: StudentAttendanceMarking },
  { path: 'mark/:date', component: StudentAttendanceMarking },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    StudentAttendanceListing,
    StudentAttendanceMarking
  ]
})
export class StudentAttendanceManagementModule { }
