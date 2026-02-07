import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ActionListing } from './pages/action-listing/action-listing';
import { ActionCreate } from './pages/action-create/action-create';

const routes: Routes = [
    { path: '', component: ActionListing },
    { path: 'action-create', component: ActionCreate },
    { path: 'action-edit/:id', component: ActionCreate }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class ActionsManagementModule { }
