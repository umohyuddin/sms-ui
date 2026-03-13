import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeRecurrenceRuleListingTableComponent } from '../../components/fee-recurrence-rule-listing-table/fee-recurrence-rule-listing-table.component';

@Component({
    selector: 'app-fee-recurrence-rule-listing',
    imports: [
        CommonModule,
        FormsModule,
        FeeRecurrenceRuleListingTableComponent
    ],
    templateUrl: './fee-recurrence-rule-listing.html',
    styleUrls: ['./fee-recurrence-rule-listing.css'],
    standalone: true,
})
export class FeeRecurrenceRuleListing implements OnInit {
    constructor(private router: Router) { }

    ngOnInit(): void { }

    goToCreateRule(): void {
        this.router.navigate(ROUTES.FEE.FEE_RECURRENCE_RULE.CREATE);
    }
}
