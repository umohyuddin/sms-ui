import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { ChargeTypeManagementService } from '../../services/charge-type-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ChargeTypeResponse } from '../../models/ChargeTypeResponse';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
    selector: 'app-charge-type-listing-table',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        LoaderComponent,
        ToasterComponent,
        DeletePopupComponent
    ],
    templateUrl: './charge-type-listing-table.component.html',
    styleUrls: ['./charge-type-listing-table.component.css']
})
export class ChargeTypeListingTableComponent implements OnInit, OnDestroy {
    texts = PageTexts.chargeType;
    pagination: Pagination<ChargeTypeResponse> = new Pagination([], 10);
    searchControl = new FormControl('');
    chargeTypes: ChargeTypeResponse[] = [];
    isLoading = false;
    loadingMessage = '';
    showDeletePopup = false;
    typeToDeleteId: any = null;

    @ViewChild('toaster') private toaster?: ToasterComponent;

    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private chargeTypeService: ChargeTypeManagementService,
        private logger: LoggerService
    ) { }

    columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'code', label: 'Code', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        { key: 'active', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ];

    ngOnInit() {
        this.getChargeTypes();
        this.subscribeToSearch();
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => {
                    this.isLoading = true;
                    this.loadingMessage = 'Searching...';
                    return this.chargeTypeService.search(search || '');
                }),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (response) => {
                    this.chargeTypes = response.body || [];
                    this.pagination = new Pagination(this.chargeTypes, this.pagination.pageSize);
                    this.isLoading = false;
                    this.loadingMessage = '';
                },
                error: (error) => {
                    this.isLoading = false;
                    this.loadingMessage = '';
                    this.toaster?.show('Search failed.', 'error');
                }
            });
    }

    private getChargeTypes() {
        this.isLoading = true;
        this.loadingMessage = 'Loading...';
        this.chargeTypeService.getAll().subscribe({
            next: (response) => {
                this.chargeTypes = response.body || [];
                this.pagination = new Pagination(this.chargeTypes, this.pagination.pageSize);
                this.isLoading = false;
                this.loadingMessage = '';
            },
            error: (error) => {
                this.isLoading = false;
                this.loadingMessage = '';
                this.toaster?.show('Failed to load charge types.', 'error');
                this.isLoading = false;
                this.loadingMessage = '';
            }
        });
    }

    viewDetails(type: ChargeTypeResponse, event: Event): void {
        event.preventDefault();
        this.router.navigate(ROUTES.FEE.CHARGE_TYPE.DETAILS(type.id.toString()));
    }

    editDetails(type: ChargeTypeResponse, event: Event): void {
        event.preventDefault();
        this.router.navigate(ROUTES.FEE.CHARGE_TYPE.EDIT(type.id.toString()));
    }

    deleteType(typeId: any, event: Event): void {
        event.stopPropagation();
        this.typeToDeleteId = typeId;
        this.showDeletePopup = true;
    }

    onConfirmDelete(): void {
        if (!this.typeToDeleteId) return;

        this.showDeletePopup = false;
        this.isLoading = true;
        this.loadingMessage = 'Deleting...';

        this.chargeTypeService.delete(this.typeToDeleteId).subscribe({
            next: () => {
                this.getChargeTypes();
                this.toaster?.show('Charge type deleted successfully', 'success');
                this.typeToDeleteId = null;
            },
            error: (error) => {
                this.isLoading = false;
                this.loadingMessage = '';
                this.toaster?.show('Failed to delete charge type.', 'error');
                this.typeToDeleteId = null;
            },
            complete: () => {
                this.isLoading = false;
                this.loadingMessage = '';
            }
        });
    }

    onCancelDelete(): void {
        this.showDeletePopup = false;
        this.typeToDeleteId = null;
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
