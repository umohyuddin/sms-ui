import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionListingComponent } from './pages/action-listing/action-listing.component';
import { ActionCreateComponent } from './pages/action-create/action-create.component';

const routes: Routes = [
    { path: '', component: ActionListingComponent },
    { path: 'action-create', component: ActionCreateComponent },
    { path: 'action-edit/:id', component: ActionCreateComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActionManagementRoutingModule { }
