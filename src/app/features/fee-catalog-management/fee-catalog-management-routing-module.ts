import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';



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



