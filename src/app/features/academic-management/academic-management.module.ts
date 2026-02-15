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
import { ExamTypeListing } from '../exam-type-management/pages/exam-type-listing/exam-type-listing';
import { ExamTypeCreate } from '../exam-type-management/pages/exam-type-create/exam-type-create';
import { ExamTermListing } from '../exam-term-management/pages/exam-term-listing/exam-term-listing';
import { ExamTermCreate } from '../exam-term-management/pages/exam-term-create/exam-term-create';
import { AssessmentTypeListing } from '../assessment-type-management/pages/assessment-type-listing/assessment-type-listing';
import { AssessmentTypeCreate } from '../assessment-type-management/pages/assessment-type-create/assessment-type-create';

const routes: Routes = [
    { path: '', redirectTo: 'subjects', pathMatch: 'full' },
    { path: 'timetable', component: TimetableManage },
    { path: 'student-attendance', component: StudentAttendancePage },
    { path: 'exams', component: ExamListingPage },
    { path: 'exams/create', component: ExamCreatePage },
    { path: 'exams/schedule', component: ExamSchedulePage },
    { path: 'exams/types', component: ExamTypeListing },
    { path: 'exams/types/create', component: ExamTypeCreate },
    { path: 'exams/types/edit/:id', component: ExamTypeCreate },
    { path: 'exams/terms', component: ExamTermListing },
    { path: 'exams/terms/create', component: ExamTermCreate },
    { path: 'exams/terms/edit/:id', component: ExamTermCreate },
    { path: 'exams/assessment-types', component: AssessmentTypeListing },
    { path: 'exams/assessment-types/create', component: AssessmentTypeCreate },
    { path: 'exams/assessment-types/edit/:id', component: AssessmentTypeCreate },
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
