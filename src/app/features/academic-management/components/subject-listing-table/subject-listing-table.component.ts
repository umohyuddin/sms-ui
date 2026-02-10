import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject as RxSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { AcademicManagementService } from '../../services/academic-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { Subject } from '../../models/academic.models';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-subject-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './subject-listing-table.component.html',
    styleUrls: ['./subject-listing-table.component.css']
})
export class SubjectListingTableComponent implements OnInit, OnDestroy {
    texts = PageTexts.academic.subjects;
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
        private academicService: AcademicManagementService,
        private logger: LoggerService
    ) { }

    ngOnInit() {
        this.getSubjects();
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
                const filtered = this.subjects.filter(s =>
                    s.name.toLowerCase().includes(search?.toLowerCase() || '') ||
                    s.code.toLowerCase().includes(search?.toLowerCase() || '')
                );
                this.pagination = new Pagination(filtered, this.pagination.pageSize);
            });
    }

    private getSubjects() {
        this.academicService.getSubjects().subscribe({
            next: (resp) => {
                this.subjects = resp.body || [];
                this.pagination = new Pagination(this.subjects, 10);
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
        if (confirm(this.texts.messages.deleteConfirmation)) {
            this.academicService.deleteSubject(id).subscribe({
                next: () => this.getSubjects(),
                error: (err) => this.logger.error('Error deleting subject', err)
            });
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
