import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceListingComponent } from './pages/resource-listing/resource-listing.component';
import { ResourceCreateComponent } from './pages/resource-create/resource-create.component';
import { ResourceDetailsComponent } from './pages/resource-details/resource-details.component';

const routes: Routes = [
    { path: '', component: ResourceListingComponent },
    { path: 'resource-create', component: ResourceCreateComponent },
    { path: 'resource-edit/:id', component: ResourceCreateComponent },
    { path: 'resource-details/:id', component: ResourceDetailsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResourceManagementRoutingModule { }
