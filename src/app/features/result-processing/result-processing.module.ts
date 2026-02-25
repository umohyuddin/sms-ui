import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResultProcessingPage } from './pages/result-processing/result-processing';

const routes: Routes = [
    { path: '', component: ResultProcessingPage }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class ResultProcessingModule { }
