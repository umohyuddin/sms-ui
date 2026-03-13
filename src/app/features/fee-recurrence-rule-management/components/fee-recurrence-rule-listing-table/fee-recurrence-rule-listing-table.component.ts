import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { FeeRecurrenceRuleManagementService } from '../../services/fee-recurrence-rule-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { FeeRecurrenceRuleResponse } from '../../models/FeeRecurrenceRuleResponse';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
    selector: 'app-fee-recurrence-rule-listing-table',
    standalone: true,
    imports: [CommonModule,
        ReactiveFormsModule,
        RouterModule,
        LoaderComponent,
        ToasterComponent,
        DeletePopupComponent
    ],
    templateUrl: './fee-recurrence-rule-listing-table.component.html',
    styleUrls: ['./fee-recurrence-rule-listing-table.component.css']
})
export class FeeRecurrenceRuleListingTableComponent implements OnInit, OnDestroy {
    texts = PageTexts.feeRecurrenceRule;
    pagination: Pagination<FeeRecurrenceRuleResponse> = new Pagination([], 10);
    searchControl = new FormControl('');
    rules: FeeRecurrenceRuleResponse[] = [];
    isLoading = false;
    loadingMessage = '';
    showDeletePopup = false;
    ruleToDeleteId: any = null;

    @ViewChild('toaster') private toaster?: ToasterComponent;

    private destroy$ = new Subject<void>();

    constructor(private router: Router,
        private feeRecurrenceRuleService: FeeRecurrenceRuleManagementService,
        private logger: LoggerService
    ) { }

    columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'code', label: 'Code', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        { key: 'isActive', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ];

    ngOnInit() {
        this.getRules();
        this.SubscribeToSearch();
    }

    private SubscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => {
                    this.isLoading = true;
                    this.loadingMessage = 'Searching Rules...';
                    return this.feeRecurrenceRuleService.searchFeeRecurrenceRules(search || '');
                }),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (response) => {
                    this.rules = response.body || [];
                    this.pagination = new Pagination(this.rules, 10);
                    this.isLoading = false;
                    this.loadingMessage = '';
                },
                error: (error) => {
                    this.isLoading = false;
                    this.loadingMessage = '';
                    console.error('Search error:', error);
                    this.toaster?.show('Search failed.', 'error');
                }
            });
    }

    private getRules() {
        this.isLoading = true;
        this.loadingMessage = 'Loading Rules...';
        this.feeRecurrenceRuleService.getAllFeeRecurrenceRules().subscribe({
            next: (response) => {
                this.rules = response.body || [];
                this.pagination = new Pagination(this.rules, 10);
            },
            error: (error) => {
                this.isLoading = false;
                this.loadingMessage = '';
                console.error('❌ Request Error Status:', error.status);
                this.toaster?.show('Failed to load recurrence rules.', 'error');
            },
            complete: () => {
                this.isLoading = false;
                this.loadingMessage = '';
            }
        })
    }

    viewRuleDetails(rule: FeeRecurrenceRuleResponse, event: Event): void {
        event.preventDefault();
        this.router.navigate(ROUTES.FEE.FEE_RECURRENCE_RULE.DETAILS(rule.id.toString()));
    }

    editRuleDetails(rule: FeeRecurrenceRuleResponse, event: Event): void {
        event.preventDefault();
        this.router.navigate(ROUTES.FEE.FEE_RECURRENCE_RULE.EDIT(rule.id.toString()));
    }

    deleteRule(ruleId: any, event: Event): void {
        event.stopPropagation();
        this.ruleToDeleteId = ruleId;
        this.showDeletePopup = true;
    }

    onConfirmDelete(): void {
        if (!this.ruleToDeleteId) return;

        this.showDeletePopup = false;
        this.isLoading = true;
        this.loadingMessage = 'Deleting Rule...';

        this.feeRecurrenceRuleService.deleteFeeRecurrenceRule(this.ruleToDeleteId).subscribe({
            next: (response: any) => {
                this.getRules();
                const message = response?.body?.message || 'Rule deleted successfully';
                this.toaster?.show(message, 'success');
                this.ruleToDeleteId = null;
            },
            error: (error) => {
                this.isLoading = false;
                this.loadingMessage = '';
                console.error('❌ Delete Error Status:', error.status);
                this.toaster?.show('Failed to delete rule.', 'error');
                this.ruleToDeleteId = null;
            },
            complete: () => {
                this.isLoading = false;
                this.loadingMessage = '';
            }
        });
    }

    onCancelDelete(): void {
        this.showDeletePopup = false;
        this.ruleToDeleteId = null;
    }

    onPageSizeChange(event: any) {
        const newSize = +event.target.value;
        this.pagination.changePageSize(newSize);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
