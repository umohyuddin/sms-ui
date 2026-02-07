import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResourceService } from '../../services/resource.service';
import { ResourceResponse } from '../../models/ResourceResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Pagination } from '../../../../core/pagar/pagination';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-resource-listing',
    standalone: true,
    imports: [CommonModule, RouterModule, DeletePopupComponent, ToasterComponent, LoaderComponent],
    templateUrl: './resource-listing.component.html',
    styleUrl: './resource-listing.component.css'
})
export class ResourceListingComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    loading: boolean = false;
    resources: ResourceResponse[] = [];
    pagination: Pagination<ResourceResponse> = new Pagination([], 10);
    isDeletePopupOpen = false;
    pendingDeleteId?: number;

    constructor(private resourceService: ResourceService, private router: Router) { }

    ngOnInit() {
        this.loadResources();
    }

    loadResources() {
        this.loading = true;
        this.resourceService.getAllResources().subscribe({
            next: (data) => {
                this.resources = data || [];
                this.pagination = new Pagination(this.resources, 10);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.toaster?.show('Failed to load resources.', 'error');
                console.error('Error loading resources:', err);
            }
        });
    }

    onAddResource() {
        this.router.navigate(ROUTES.RESOURCES.CREATE);
    }

    onEditResource(res: ResourceResponse) {
        this.router.navigate(ROUTES.RESOURCES.EDIT(res.id.toString()));
    }

    onDeleteResource(id: number) {
        this.pendingDeleteId = id;
        this.isDeletePopupOpen = true;
    }

    onConfirmDelete() {
        if (this.pendingDeleteId) {
            this.loading = true;
            this.resourceService.deleteResource(this.pendingDeleteId).subscribe({
                next: () => {
                    this.resources = this.resources.filter(r => r.id !== this.pendingDeleteId);
                    this.pagination = new Pagination(this.resources, 10);
                    this.isDeletePopupOpen = false;
                    this.loading = false;
                    this.toaster?.show('Resource deleted successfully.', 'success');
                },
                error: (err) => {
                    this.loading = false;
                    this.toaster?.show('Failed to delete resource.', 'error');
                    console.error('Delete error:', err);
                    this.isDeletePopupOpen = false;
                }
            });
        }
    }

    onCancelDelete() {
        this.isDeletePopupOpen = false;
    }
}
