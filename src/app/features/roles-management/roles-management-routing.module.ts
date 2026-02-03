import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesListingComponent } from './pages/roles-listing/roles-listing.component';
import { RolesDetailsComponent } from './pages/roles-details/roles-details.component';
import { RolesCreateComponent } from './pages/roles-create/roles-create.component';

const routes: Routes = [
  { path: '', component: RolesListingComponent },
  { path: 'roles-details/:id', component: RolesDetailsComponent },
  { path: 'roles-edit/:id', component: RolesCreateComponent },
  { path: 'roles-create', component: RolesCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesManagementRoutingModule { }
