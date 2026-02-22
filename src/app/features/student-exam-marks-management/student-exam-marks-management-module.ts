import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentExamMarksListing } from './pages/student-exam-marks-listing/student-exam-marks-listing';
import { StudentExamMarksCreate } from './pages/student-exam-marks-create/student-exam-marks-create';

const routes: Routes = [
    { path: '', component: StudentExamMarksListing },
    { path: 'student-exam-marks-create', component: StudentExamMarksCreate },
    { path: 'student-exam-marks-edit/:id', component: StudentExamMarksCreate }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class StudentExamMarksManagementModule { }
