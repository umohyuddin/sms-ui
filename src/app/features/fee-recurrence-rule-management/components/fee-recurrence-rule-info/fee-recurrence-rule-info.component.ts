import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FeeRecurrenceRuleManagementService } from '../../services/fee-recurrence-rule-management.service';
import { FeeRecurrenceRuleResponse } from '../../models/FeeRecurrenceRuleResponse';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';

@Component({
    selector: 'app-fee-recurrence-rule-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './fee-recurrence-rule-info.component.html',
    styleUrls: ['./fee-recurrence-rule-info.component.css']
})
export class FeeRecurrenceRuleInfoComponent implements OnInit {
    private readonly MODULE = 'FeeRecurrenceRule';
    private readonly COMPONENT = 'InfoDisplay';

    ruleData?: FeeRecurrenceRuleResponse;
    ruleId!: string;

    constructor(
        private feeRecurrenceRuleService: FeeRecurrenceRuleManagementService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        LoggerUtil.group(`📌 [${this.MODULE}] Init`);
        this.ruleId = this.route.snapshot.paramMap.get('id') ?? '';
        if (this.ruleId) {
            this.getRuleDetails(this.ruleId);
        }
        LoggerUtil.groupEnd();
    }

    getRuleDetails(id: string): void {
        this.feeRecurrenceRuleService.getFeeRecurrenceRuleById(id).subscribe({
            next: (response) => {
                this.ruleData = response.body;
            },
            error: (error) => {
                LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Failed to load rule details', error);
            }
        });
    }

    getInitials(name?: string): string {
        return SmsUtil.getInitials(name ?? '');
    }
}
