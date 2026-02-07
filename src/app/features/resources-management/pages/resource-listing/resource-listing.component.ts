import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResourceService } from '../../services/resource.service';
import { ResourceResponse } from '../../models/ResourceResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Pagination } from '../../../../core/pagar/pagination';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
    selector: 'app-resource-listing',
    standalone: true,
    imports: [CommonModule, RouterModule, DeletePopupComponent],
    templateUrl: './resource-listing.component.html',
    styleUrl: './resource-listing.component.css'
})
export class ResourceListingComponent implements OnInit {
    resources: ResourceResponse[] = [];
    pagination: Pagination<ResourceResponse> = new Pagination([], 10);
    isDeletePopupOpen = false;
    pendingDeleteId?: number;

    constructor(private resourceService: ResourceService, private router: Router) { }

    ngOnInit() {
        this.loadResources();
    }

    loadResources() {
        this.resourceService.getAllResources().subscribe({
            next: (data) => {
                this.resources = data || [];
                this.pagination = new Pagination(this.resources, 10);
            },
            error: (err) => console.error('Error loading resources:', err)
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
            this.resourceService.deleteResource(this.pendingDeleteId).subscribe({
                next: () => {
                    this.resources = this.resources.filter(r => r.id !== this.pendingDeleteId);
                    this.pagination = new Pagination(this.resources, 10);
                    this.isDeletePopupOpen = false;
                },
                error: (err) => {
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
