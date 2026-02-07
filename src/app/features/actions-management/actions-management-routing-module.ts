import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionListing } from './pages/action-listing/action-listing';
import { ActionCreate } from './pages/action-create/action-create';

const routes: Routes = [
    { path: '', component: ActionListing },
    { path: 'action-create', component: ActionCreate },
    { path: 'action-edit/:id', component: ActionCreate }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActionManagementRoutingModule { }
