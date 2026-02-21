import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExamSubjectListing } from './pages/exam-subject-listing/exam-subject-listing';
import { ExamSubjectCreate } from './pages/exam-subject-create/exam-subject-create';
import { ExamSubjectDetails } from './pages/exam-subject-details/exam-subject-details';

const routes: Routes = [
    { path: '', component: ExamSubjectListing },
    { path: 'create', component: ExamSubjectCreate },
    { path: 'edit/:id', component: ExamSubjectCreate },
    { path: 'details/:id', component: ExamSubjectDetails }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class ExamSubjectManagementModule { }
