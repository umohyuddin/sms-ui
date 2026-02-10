import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { AcademicManagementService } from '../../services/academic-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { SubjectGroup } from '../../models/academic.models';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-subject-group-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './subject-group-listing-table.component.html',
    styleUrls: ['./subject-group-listing-table.component.css']
})
export class SubjectGroupListingTableComponent implements OnInit, OnDestroy {
    texts = PageTexts.academic.subjectGroups;
    pagination: Pagination<SubjectGroup> = new Pagination([], 10);
    searchControl = new FormControl('');
    subjectGroups: SubjectGroup[] = [];

    columns = [
        { key: 'name', label: 'Group Name' },
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private academicService: AcademicManagementService,
        private logger: LoggerService
    ) { }

    ngOnInit() {
        this.getGroups();
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
                const filtered = this.subjectGroups.filter(g =>
                    g.name.toLowerCase().includes(search?.toLowerCase() || '') ||
                    g.code.toLowerCase().includes(search?.toLowerCase() || '')
                );
                this.pagination = new Pagination(filtered, this.pagination.pageSize);
            });
    }

    private getGroups() {
        this.academicService.getSubjectGroups().subscribe({
            next: (resp) => {
                this.subjectGroups = resp.body || [];
                this.pagination = new Pagination(this.subjectGroups, 10);
            },
            error: (err) => this.logger.error('Error fetching subject groups', err)
        });
    }

    editGroup(group: SubjectGroup, event: Event) {
        event.preventDefault();
        this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.EDIT(group.id!.toString()));
    }

    deleteGroup(id: number | undefined, event: Event) {
        if (!id) return;
        event.stopPropagation();
        if (confirm(this.texts.messages.deleteConfirmation)) {
            this.academicService.deleteSubjectGroup(id).subscribe({
                next: () => this.getGroups(),
                error: (err) => this.logger.error('Error deleting subject group', err)
            });
        }
    }

    onPageSizeChange(event: any) {
        this.pagination.changePageSize(+event.target.value);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
