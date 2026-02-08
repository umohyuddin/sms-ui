import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ResourceInfoComponent } from '../../components/resource-info/resource-info.component';

@Component({
    selector: 'app-resource-details',
    standalone: true,
    imports: [CommonModule, ResourceInfoComponent],
    templateUrl: './resource-details.component.html',
    styleUrl: './resource-details.component.css'
})
export class ResourceDetailsComponent implements OnInit {
    resourceId: number | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            this.resourceId = id ? +id : null;
            console.log('Resource ID from URL:', this.resourceId);
        });
    }

    goToUpdatePage() {
        if (this.resourceId) {
            this.router.navigate(ROUTES.RESOURCES.EDIT(this.resourceId.toString()));
        } else {
            console.log('Resource ID from URL Not Found:');
        }
    }
}
