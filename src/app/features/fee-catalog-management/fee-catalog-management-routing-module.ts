import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';
import { FeeCatalogListing } from './pages/fee-catalog-listing/fee-catalog-listing';
import { FeeCatalogDetails } from './pages/fee-catalog-details/fee-catalog-details';
import { FeeCatalogCreate } from './pages/fee-catalog-create/fee-catalog-create';



const routes: Routes = [
  { path: '', component: FeeCatalogListing },
  { path: 'fee-catalog-details/:id', component: FeeCatalogDetails },
  { path: 'fee-catalog-create', component: FeeCatalogCreate },
   { path: 'fee-catalog-edit/:id', component: FeeCatalogCreate },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class FeeCatalogManagementRoutingModule { }



