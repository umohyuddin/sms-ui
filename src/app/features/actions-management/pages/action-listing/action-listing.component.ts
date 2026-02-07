import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ActionService } from '../../services/action.service';
import { ActionResponse } from '../../models/ActionResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Pagination } from '../../../../core/pagar/pagination';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-action-listing',
    standalone: true,
    imports: [CommonModule, RouterModule, DeletePopupComponent, ToasterComponent, LoaderComponent],
    templateUrl: './action-listing.component.html'
})
export class ActionListingComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    loading: boolean = false;
    actions: ActionResponse[] = [];
    pagination: Pagination<ActionResponse> = new Pagination([], 10);
    isDeletePopupOpen = false;
    pendingDeleteId?: number;

    constructor(private actionService: ActionService, private router: Router) { }

    ngOnInit() {
        this.loadActions();
    }

    loadActions() {
        this.loading = true;
        this.actionService.getAllActions().subscribe({
            next: (data) => {
                console.log('📊 API Response:', data);
                console.log('📊 Response Type:', typeof data);
                console.log('📊 Is Array:', Array.isArray(data));
                this.actions = Array.isArray(data) ? data : (data?.data || []);
                console.log('✅ Actions set:', this.actions);
                this.pagination = new Pagination(this.actions, 10);
                console.log('📄 Pagination initialized with', this.actions.length, 'items');
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.toaster?.show('Failed to load actions.', 'error');
                console.error('Error loading actions:', err);
            }
        });
    }

    onAddAction() {
        this.router.navigate(ROUTES.ACTIONS.CREATE);
    }

    onEditAction(action: ActionResponse) {
        this.router.navigate(ROUTES.ACTIONS.EDIT(action.id.toString()));
    }

    onDeleteAction(id: number) {
        this.pendingDeleteId = id;
        this.isDeletePopupOpen = true;
    }

    onConfirmDelete() {
        if (this.pendingDeleteId) {
            this.loading = true;
            this.actionService.deleteAction(this.pendingDeleteId).subscribe({
                next: () => {
                    this.actions = this.actions.filter(a => a.id !== this.pendingDeleteId);
                    this.pagination = new Pagination(this.actions, 10);
                    this.isDeletePopupOpen = false;
                    this.loading = false;
                    this.toaster?.show('Action deleted successfully.', 'success');
                },
                error: (err) => {
                    this.loading = false;
                    this.toaster?.show('Failed to delete action.', 'error');
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
