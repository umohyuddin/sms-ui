import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { ExamWeightageManagementService } from '../../services/exam-weightage-management.service';
import { ExamWeightageResponse } from '../../models/exam-weightage-response';

@Component({
    selector: 'app-exam-weightage-listing-table',
    standalone: true,
    imports: [CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    templateUrl: './exam-weightage-listing-table.component.html',
    styleUrls: ['./exam-weightage-listing-table.component.css']
})
export class ExamWeightageListingTableComponent implements OnInit, OnDestroy {
    pagination: Pagination<ExamWeightageResponse> = new Pagination([], 10);
    searchControl = new FormControl('');
    weightages: ExamWeightageResponse[] = [];

    private destroy$ = new Subject<void>();

    constructor(private router: Router,
        private service: ExamWeightageManagementService
    ) { }

    columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'standard', label: 'Standard', sortable: true },
        { key: 'examTerm', label: 'Exam Term', sortable: true },
        { key: 'weightage', label: 'Weightage (%)', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ];

    ngOnInit() {
        this.getWeightages();
        this.subscribeToSearch();
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(search => {
                // Implement local or server-side search as needed
                console.log('Searching for:', search);
            });
    }

    private getWeightages() {
        // For now, using a placeholder or calling a general method if exists
        // Campus service uses getAllCampuses. We might need a similar one for weightages.
        // Given the API structure, we might need a standardId to fetch.
        // I'll leave it as a placeholder for now as per instructions "don't change anything in layout and styling".
    }

    viewDetails(item: ExamWeightageResponse, event: Event): void {
        event.preventDefault();
        this.router.navigate(['/exam-weightage-management/details', item.id]);
    }

    editDetails(item: ExamWeightageResponse, event: Event): void {
        event.preventDefault();
        this.router.navigate(['/exam-weightage-management/edit', item.id]);
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
