import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { InstituteAccreditationResponseDTO } from '../../models/institute-accreditation.model';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
    selector: 'app-institute-accreditation-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent, DeletePopupComponent],
    templateUrl: './institute-accreditation-listing-table.component.html',
    styleUrl: './institute-accreditation-listing-table.component.css'
})
export class InstituteAccreditationListingTableComponent implements OnInit, OnChanges, OnDestroy {
    @Input() instituteId?: number;
    @Output() accreditationEdit = new EventEmitter<number>();
    @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

    pagination: Pagination<InstituteAccreditationResponseDTO> = new Pagination([], 10);
    searchControl = new FormControl('');
    accreditations: InstituteAccreditationResponseDTO[] = [];
    isLoading = false;

    isDeletePopupOpen = false;
    pendingDeleteId?: number;

    private destroy$ = new Subject<void>();

    columns = [
        { key: 'authorityName', label: 'Authority Name', sortable: true },
        { key: 'licenseNumber', label: 'License Number', sortable: true },
        { key: 'validFrom', label: 'Valid From', sortable: true },
        { key: 'validTo', label: 'Valid To', sortable: true },
        { key: 'isActive', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ];

    constructor(private schoolProfileManagementService: SchoolProfileManagementService, private logger: LoggerService) { }

    ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
        this.refreshAccreditations();
        this.subscribeToSearch();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['instituteId'] && changes['instituteId'].currentValue) {
            this.refreshAccreditations();
        }
    }

    refreshAccreditations() {
        if (!this.instituteId) return;
        this.isLoading = true;
        this.schoolProfileManagementService.getInstituteAccreditationsByInstituteId(this.instituteId).subscribe({
            next: (response: any) => {
                this.applyResponse(response.body);
            },
            error: (error: any) => {
                this.isLoading = false;
                this.toaster?.show('Failed to load accreditations.', 'error');
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => {
                    const keyword = search || '';
                    this.isLoading = true;
                    if (!this.instituteId) {
                        this.isLoading = false;
                        return [] as any;
                    }
                    return this.schoolProfileManagementService.searchInstituteAccreditations(this.instituteId, keyword);
                }),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (response: any) => {
                    this.applyResponse(response.body);
                    this.isLoading = false;
                },
                error: (error: any) => {
                    this.isLoading = false;
                    this.toaster?.show('Search failed.', 'error');
                }
            });
    }

    private applyResponse(body: any) {
        const data = body?.content ?? body ?? [];
        this.accreditations = data;
        this.pagination = new Pagination(this.accreditations, 10);
    }

    editAccreditation(id: number, event: Event): void {
        event.stopPropagation();
        this.accreditationEdit.emit(id);
    }

    deleteAccreditation(id: number, event: Event): void {
        event.stopPropagation();
        this.pendingDeleteId = id;
        this.isDeletePopupOpen = true;
    }

    confirmDelete(): void {
        if (!this.pendingDeleteId || !this.instituteId) {
            this.isDeletePopupOpen = false;
            return;
        }

        this.isDeletePopupOpen = false;
        this.isLoading = true;
        this.schoolProfileManagementService.deleteInstituteAccreditation(this.pendingDeleteId, this.instituteId).subscribe({
            next: () => {
                this.refreshAccreditations();
                this.toaster?.show('Accreditation deleted successfully.', 'success');
            },
            error: (error: any) => {
                this.isLoading = false;
                this.toaster?.show('Failed to delete accreditation.', 'error');
            }
        });
    }

    cancelDelete(): void {
        this.isDeletePopupOpen = false;
        this.pendingDeleteId = undefined;
    }

    toggleStatus(accreditation: InstituteAccreditationResponseDTO, event: Event) {
        event.stopPropagation();
        const request$ = accreditation.isActive
            ? this.schoolProfileManagementService.deactivateAccreditation(accreditation.id)
            : this.schoolProfileManagementService.activateAccreditation(accreditation.id);

        this.isLoading = true;
        request$.subscribe({
            next: () => {
                this.refreshAccreditations();
                this.toaster?.show(`Accreditation ${accreditation.isActive ? 'deactivated' : 'activated'} successfully.`, 'success');
            },
            error: () => {
                this.isLoading = false;
                this.toaster?.show('Failed to update status.', 'error');
            }
        });
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
