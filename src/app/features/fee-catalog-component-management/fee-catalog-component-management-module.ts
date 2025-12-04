import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FeeCatalogComponentListing } from './pages/fee-catalog-component-listing/fee-catalog-component-listing';
import { FeeCatalogComponentDetails } from './pages/fee-catalog-component-details/fee-catalog-component-details';
import { FeeCatalogComponentCreate } from './pages/fee-catalog-component-create/fee-catalog-component-create';

const routes: Routes = [
  { path: '', component: FeeCatalogComponentListing },
  { path: 'fee-catalog-component-details/:id', component: FeeCatalogComponentDetails },
  { path: 'fee-catalog-component-edit/:id', component: FeeCatalogComponentCreate },
  { path: 'fee-catalog-component-create', component: FeeCatalogComponentCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class FeeCatalogComponentManagementModule { }
