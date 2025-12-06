import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FeeCatalogDetails } from './pages/fee-catalog-details/fee-catalog-details';
import { FeeCatalogCreate } from './pages/campus-create/fee-catalog-create';
import { FeeCatalogListing } from './pages/fee-catalog-listing/fee-catalog-listing';



const routes: Routes = [
  { path: '', component: FeeCatalogListing },
  { path: 'fee-catalog-details/:id', component: FeeCatalogDetails },
  { path: 'fee-catalog-edit/:id', component: FeeCatalogCreate },
  { path: 'fee-catalog-create', component: FeeCatalogCreate }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class FeeCatalogManagementModule { }
