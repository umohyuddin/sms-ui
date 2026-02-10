import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject as RxSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { SubjectManagementService } from '../../services/subject-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { Subject } from '../../models/subject.model';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-subject-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './subject-listing-table.component.html',
    styleUrls: ['./subject-listing-table.component.css']
})
export class SubjectListingTableComponent implements OnInit, OnDestroy {
    pagination: Pagination<Subject> = new Pagination([], 10);
    searchControl = new FormControl('');
    subjects: Subject[] = [];

    columns = [
        { key: 'name', label: 'Subject Name' },
        { key: 'code', label: 'Code' },
        { key: 'group', label: 'Group' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    private destroy$ = new RxSubject<void>();

    constructor(
        private router: Router,
        private subjectService: SubjectManagementService,
        private logger: LoggerService
    ) { }

    ngOnInit() {
        this.logger.group('SubjectListingTableComponent');
        this.logger.info('Initializing subject listing table');
        this.getSubjects();
        this.subscribeToSearch();
        this.logger.groupEnd();
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(search => {
                const filtered = this.subjects.filter(s =>
                    s.name.toLowerCase().includes(search?.toLowerCase() || '') ||
                    s.code.toLowerCase().includes(search?.toLowerCase() || '')
                );
                this.pagination = new Pagination(filtered, this.pagination.pageSize);
            });
    }

    private getSubjects() {
        this.subjectService.getSubjects().subscribe({
            next: (resp) => {
                this.subjects = resp.body || [];
                this.pagination = new Pagination(this.subjects, 10);
                this.logger.success('Subjects loaded successfully');
            },
            error: (err) => this.logger.error('Error fetching subjects', err)
        });
    }

    onPageSizeChange(event: any) {
        this.pagination.changePageSize(+event.target.value);
    }

    editSubject(subject: Subject, event: Event) {
        event.preventDefault();
        this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.EDIT(subject.id!.toString()));
    }

    deleteSubject(id: number | undefined, event: Event) {
        if (!id) return;
        event.stopPropagation();
        if (confirm('Are you sure you want to delete this subject?')) {
            this.subjectService.deleteSubject(id).subscribe({
                next: () => {
                    this.logger.success('Subject deleted successfully');
                    this.getSubjects();
                },
                error: (err) => this.logger.error('Error deleting subject', err)
            });
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
