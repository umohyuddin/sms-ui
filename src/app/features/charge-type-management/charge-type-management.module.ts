import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChargeTypeListing } from './pages/charge-type-listing/charge-type-listing';
import { ChargeTypeCreate } from './pages/charge-type-create/charge-type-create';
import { ChargeTypeDetails } from './pages/charge-type-details/charge-type-details';

const routes: Routes = [
    { path: '', component: ChargeTypeListing },
    { path: 'charge-type-create', component: ChargeTypeCreate },
    { path: 'charge-type-edit/:id', component: ChargeTypeCreate },
    { path: 'charge-type-details/:id', component: ChargeTypeDetails },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class ChargeTypeManagementModule { }
