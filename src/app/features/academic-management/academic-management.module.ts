import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TimetableManage } from './pages/timetable-manage/timetable-manage';
import { StudentAttendancePage } from './pages/student-attendance/student-attendance';
import { ExamListingPage } from './pages/exam-listing/exam-listing';
import { ExamCreatePage } from './pages/exam-create/exam-create';
import { ExamSchedulePage } from './pages/exam-schedule/exam-schedule';
import { MarksEntryPage } from './pages/marks-entry/marks-entry';
import { ResultProcessingPage } from './pages/result-processing/result-processing';
import { GradeScaleListingPage } from './pages/grade-scale-listing/grade-scale-listing';

const routes: Routes = [
    { path: '', redirectTo: 'subjects', pathMatch: 'full' },
    { path: 'timetable', component: TimetableManage },
    { path: 'student-attendance', component: StudentAttendancePage },
    { path: 'exams', component: ExamListingPage },
    { path: 'exams/create', component: ExamCreatePage },
    { path: 'exams/schedule', component: ExamSchedulePage },
    { path: 'marks-entry', component: MarksEntryPage },
    { path: 'results', component: ResultProcessingPage },
    { path: 'grade-scales', component: GradeScaleListingPage }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class AcademicManagementModule { }
