import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExamMgmtListing } from './pages/exam-listing/exam-listing';
import { ExamMgmtCreatePage } from './pages/exam-create/exam-create';

const routes: Routes = [
    {
        path: '',
        component: ExamMgmtListing
    },
    {
        path: 'listing',
        component: ExamMgmtListing
    },
    {
        path: 'create',
        component: ExamMgmtCreatePage
    },
    {
        path: 'edit/:id',
        component: ExamMgmtCreatePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamManagementRoutingModule { }
