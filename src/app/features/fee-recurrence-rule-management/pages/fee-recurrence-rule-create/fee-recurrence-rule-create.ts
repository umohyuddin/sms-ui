import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeRecurrenceRuleCreateFormComponent } from '../../components/fee-recurrence-rule-create-form/fee-recurrence-rule-create-form.component';

@Component({
    selector: 'app-fee-recurrence-rule-create',
    standalone: true,
    imports: [
        CommonModule,
        FeeRecurrenceRuleCreateFormComponent
    ],
    templateUrl: './fee-recurrence-rule-create.html',
    styleUrls: ['./fee-recurrence-rule-create.css']
})
export class FeeRecurrenceRuleCreate {
    constructor() { }
}
