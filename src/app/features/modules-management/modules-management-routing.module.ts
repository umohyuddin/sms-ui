import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesListingComponent } from './pages/modules-listing/modules-listing.component';
import { ModulesDetailsComponent } from './pages/modules-details/modules-details.component';
import { ModulesCreateComponent } from './pages/modules-create/modules-create.component';

const routes: Routes = [
  { path: '', component: ModulesListingComponent },
  { path: 'modules-details/:id', component: ModulesDetailsComponent },
  { path: 'modules-edit/:id', component: ModulesCreateComponent },
  { path: 'modules-create', component: ModulesCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesManagementRoutingModule { }
