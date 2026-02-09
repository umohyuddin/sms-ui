import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { ResourceService } from '../../services/resource.service';
import { ResourceResponse } from '../../models/ResourceResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-resource-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ToasterComponent, LoaderComponent],
    templateUrl: './resource-listing-table.component.html',
    styleUrls: ['./resource-listing-table.component.css']
})
export class ResourceListingTableComponent {
    @ViewChild('toaster') toaster!: ToasterComponent;
    @Output() deleteResource = new EventEmitter<number>();

    loading: boolean = false;
    pagination: Pagination<ResourceResponse> = new Pagination([], 10);
    searchControl = new FormControl('');
    resources: ResourceResponse[] = [];

    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private resourceService: ResourceService
    , private logger: LoggerService) { }

    columns = [
        { key: 'moduleName', label: 'Module', sortable: true },
        { key: 'resourceName', label: 'Resource Name', sortable: true },
        { key: 'version', label: 'Version', sortable: false },
        { key: 'authRequired', label: 'Auth Required', sortable: false },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ];

    ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
        this.loadResources();
        this.subscribeToSearch();
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => {
                    this.loading = true;
                    return this.resourceService.getAllResources();
                }),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (response) => {
                    this.resources = response || [];
                    this.pagination = new Pagination(this.resources, 10);
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this.toaster?.show('Failed to search resources.', 'error');
                    this.logger.error('Search error', error);
                }
            });
    }

    loadResources() {
        this.loading = true;
        this.resourceService.getAllResources().subscribe({
            next: (response) => {
                this.logger.info('Resources loaded', response);
                this.resources = response || [];
                this.pagination = new Pagination(this.resources, 10);
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.toaster?.show('Failed to load resources.', 'error');
                this.logger.error('Failed to load resources', error);
            }
        });
    }

    viewResourceDetails(resource: ResourceResponse, event: Event): void {
        event.preventDefault();
        this.logger.info('Viewing Resource ID', resource.id);
        this.router.navigate(ROUTES.RESOURCES.DETAILS(resource.id.toString()));
    }

    editResourceDetails(resource: ResourceResponse, event: Event): void {
        event.preventDefault();
        this.logger.info('Editing Resource ID', resource.id);
        this.router.navigate(ROUTES.RESOURCES.EDIT(resource.id.toString()));
    }

    onDeleteResource(resourceId: number, event: Event): void {
        event.stopPropagation();

        if (!resourceId) {
            this.toaster?.show('Invalid Resource selected', 'error');
            return;
        }

        this.deleteResource.emit(resourceId);
    }

    onPageSizeChange(event: any) {
        this.pagination.changePageSize(+event.target.value);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
