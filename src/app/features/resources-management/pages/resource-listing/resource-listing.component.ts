import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResourceListingTableComponent } from '../../components/resource-listing-table/resource-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-resource-listing',
    standalone: true,
    imports: [CommonModule, RouterModule, ResourceListingTableComponent],
    templateUrl: './resource-listing.component.html',
    styleUrl: './resource-listing.component.css'
})
export class ResourceListingComponent {
    
    constructor(private router: Router) { }

    goToCreateResource(): void {
        this.router.navigate(ROUTES.RESOURCES.CREATE);
    }
}
