import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StandardSubjectMappingListing } from './pages/standard-subject-mapping-listing/standard-subject-mapping-listing';

const routes: Routes = [
    { path: '', component: StandardSubjectMappingListing }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class StandardSubjectMappingManagementModule { }
