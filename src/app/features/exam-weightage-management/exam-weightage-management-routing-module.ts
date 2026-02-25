import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExamWeightageListing } from './pages/exam-weightage-listing/exam-weightage-listing';
import { ExamWeightageCreate } from './pages/exam-weightage-create/exam-weightage-create';
import { ExamWeightageDetails } from './pages/exam-weightage-details/exam-weightage-details';

const routes: Routes = [
    { path: '', component: ExamWeightageListing },
    { path: 'details/:id', component: ExamWeightageDetails },
    { path: 'create', component: ExamWeightageCreate },
    { path: 'edit/:id', component: ExamWeightageCreate },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ExamWeightageManagementRoutingModule { }
