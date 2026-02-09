import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ResourceListingTableComponent } from '../../components/resource-listing-table/resource-listing-table.component';
import { ResourceService } from '../../services/resource.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ResourceResponse } from '../../models/ResourceResponse';

@Component({
    selector: 'app-resource-listing',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ResourceListingTableComponent,
        DeletePopupComponent,
        ToasterComponent,
        LoaderComponent
    ],
    templateUrl: './resource-listing.component.html',
    styleUrl: './resource-listing.component.css'
})
export class ResourceListingComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    @ViewChild(ResourceListingTableComponent) table!: ResourceListingTableComponent;

    isDeletePopupOpen = false;
    pendingDeleteId?: number;
    loading = false;

    constructor(private router: Router, private resourceService: ResourceService, private logger: LoggerService) { }

    ngOnInit(): void { }

    goToCreateResource(): void {
        this.router.navigate(ROUTES.RESOURCES.CREATE);
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
                    this.isDeletePopupOpen = false;
                    this.loading = false;
                    this.toaster?.show('Resource deleted successfully.', 'success');
                    this.table.loadResources();
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
