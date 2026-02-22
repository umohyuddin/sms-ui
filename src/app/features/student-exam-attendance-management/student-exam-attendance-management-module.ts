import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentExamAttendanceListing } from './pages/student-exam-attendance-listing/student-exam-attendance-listing';
import { StudentExamAttendanceCreate } from './pages/student-exam-attendance-create/student-exam-attendance-create';

const routes: Routes = [
    {
        path: '',
        component: StudentExamAttendanceListing
    },
    {
        path: 'student-exam-attendance-create',
        component: StudentExamAttendanceCreate
    },
    {
        path: 'student-exam-attendance-edit/:id',
        component: StudentExamAttendanceCreate
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        StudentExamAttendanceListing,
        StudentExamAttendanceCreate
    ]
})
export class StudentExamAttendanceManagementModule { }
