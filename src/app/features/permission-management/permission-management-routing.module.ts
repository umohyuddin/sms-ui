import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionListingComponent } from './pages/permission-listing/permission-listing.component';
import { PermissionDetailsComponent } from './pages/permission-details/permission-details.component';
import { PermissionCreateComponent } from './pages/permission-create/permission-create.component';

const routes: Routes = [
  { path: '', component: PermissionListingComponent },
  { path: 'permission-details/:id', component: PermissionDetailsComponent },
  { path: '', component: PermissionListingComponent },
  { path: 'permission-details/:id', component: PermissionDetailsComponent },
  { path: 'manage', component: PermissionCreateComponent },
  { path: 'permission-create', redirectTo: 'manage', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionManagementRoutingModule { }
