import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceListingComponent } from './pages/resource-listing/resource-listing.component';
import { ResourceCreateComponent } from './pages/resource-create/resource-create.component';

const routes: Routes = [
    { path: '', component: ResourceListingComponent },
    { path: 'resource-create', component: ResourceCreateComponent },
    { path: 'resource-edit/:id', component: ResourceCreateComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResourceManagementRoutingModule { }
