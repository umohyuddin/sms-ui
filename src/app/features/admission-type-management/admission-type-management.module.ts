import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionTypeCreate } from './pages/admission-type-create/admission-type-create';
import { AdmissionTypeDetails } from './pages/admission-type-details/admission-type-details';
import { AdmissionTypeListing } from './pages/admission-type-listing/admission-type-listing';

const routes: Routes = [
  { path: '', component: AdmissionTypeListing },
  { path: 'admission-type-details/:id', component: AdmissionTypeDetails },
  { path: 'admission-type-edit/:id', component: AdmissionTypeCreate },
  { path: 'admission-type-create', component: AdmissionTypeCreate }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class AdmissionTypeManagementModule { }
