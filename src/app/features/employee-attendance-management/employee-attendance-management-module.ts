import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeeAttendanceListing } from './pages/employee-attendance-listing/employee-attendance-listing';
import { EmployeeAttendanceMarking } from './pages/employee-attendance-marking/employee-attendance-marking';

const routes: Routes = [
  { path: '', component: EmployeeAttendanceListing },
  { path: 'mark', component: EmployeeAttendanceMarking },
  { path: 'mark/:date', component: EmployeeAttendanceMarking },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    EmployeeAttendanceListing,
    EmployeeAttendanceMarking
  ]
})
export class EmployeeAttendanceManagementModule { }
