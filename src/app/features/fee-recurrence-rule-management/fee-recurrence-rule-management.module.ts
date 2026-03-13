import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FeeRecurrenceRuleListing } from './pages/fee-recurrence-rule-listing/fee-recurrence-rule-listing';
import { FeeRecurrenceRuleCreate } from './pages/fee-recurrence-rule-create/fee-recurrence-rule-create';
import { FeeRecurrenceRuleDetails } from './pages/fee-recurrence-rule-details/fee-recurrence-rule-details';

const routes: Routes = [
    { path: '', component: FeeRecurrenceRuleListing },
    { path: 'fee-recurrence-rule-create', component: FeeRecurrenceRuleCreate },
    { path: 'fee-recurrence-rule-edit/:id', component: FeeRecurrenceRuleCreate },
    { path: 'fee-recurrence-rule-details/:id', component: FeeRecurrenceRuleDetails },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class FeeRecurrenceRuleManagementModule { }
