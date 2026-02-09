import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ActionResponse } from '../../models/ActionResponse';
import { ActionService } from '../../services/action.service';
import { Pagination } from '../../../../core/pagar/pagination';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
    selector: 'app-action-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './action-listing-table.component.html',
    styleUrl: './action-listing-table.component.css'
})
export class ActionListingTableComponent implements OnInit, OnDestroy {
    @Output() edit = new EventEmitter<ActionResponse>();
    @Output() delete = new EventEmitter<number>();

    actions: ActionResponse[] = [];
    pagination: Pagination<ActionResponse> = new Pagination([], 10);
    searchControl = new FormControl('');
    loading = false;

    private destroy$ = new Subject<void>();

    columns = [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    constructor(private actionService: ActionService, private logger: LoggerService) { }

    ngOnInit() {
        this.loadActions();
        this.subscribeToSearch();
    }

    loadActions() {
        this.loading = true;
        this.actionService.getAllActions().subscribe({
            next: (data) => {
                this.actions = Array.isArray(data) ? data : (data?.data || []);
                this.pagination = new Pagination(this.actions, 10);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                console.error('Error loading actions:', err);
            }
        });
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe((keyword) => {
                this.performSearch(keyword || '');
            });
    }

    private performSearch(keyword: string) {
        this.loading = true;
        
        if (!keyword || keyword.trim() === '') {
            // If search is empty, reload all actions
            this.loadActions();
            return;
        }

        this.actionService.searchActions(keyword).subscribe({
            next: (data) => {
                const results = Array.isArray(data) ? data : (data?.data || []);
                this.pagination = new Pagination(results, this.pagination.pageSize);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                console.error('Error searching actions:', err);
            }
        });
    }

    onEditAction(action: ActionResponse) {
        this.edit.emit(action);
    }

    onDeleteAction(id: number) {
        this.delete.emit(id);
    }

    onPageSizeChange(event: any) {
        const newSize = +event.target.value;
        this.pagination.changePageSize(newSize);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
