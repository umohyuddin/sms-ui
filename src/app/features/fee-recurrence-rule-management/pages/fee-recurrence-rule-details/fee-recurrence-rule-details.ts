import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FeeRecurrenceRuleInfoComponent } from '../../components/fee-recurrence-rule-info/fee-recurrence-rule-info.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-fee-recurrence-rule-details',
    standalone: true,
    imports: [CommonModule, FeeRecurrenceRuleInfoComponent],
    templateUrl: './fee-recurrence-rule-details.html',
    styleUrls: ['./fee-recurrence-rule-details.css']
})
export class FeeRecurrenceRuleDetails implements OnInit {
    ruleId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.ruleId = params.get('id');
        });
    }

    goToUpdatePage() {
        if (this.ruleId) {
            this.router.navigate(ROUTES.FEE.FEE_RECURRENCE_RULE.EDIT(this.ruleId));
        }
    }
}
