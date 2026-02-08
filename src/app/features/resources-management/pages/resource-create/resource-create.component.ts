import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ResourceCreateFormComponent } from '../../components/resource-create-form/resource-create-form.component';

@Component({
    selector: 'app-resource-create',
    standalone: true,
    imports: [
        CommonModule,
        ResourceCreateFormComponent
    ],
    templateUrl: './resource-create.component.html',
    styleUrl: './resource-create.component.css'
})
export class ResourceCreateComponent implements OnInit {
    isEditMode = false;
    resourceId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.resourceId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.resourceId;
    }

    goToCreateResource(): void {
        this.router.navigate(ROUTES.RESOURCES.CREATE);
    }
}
