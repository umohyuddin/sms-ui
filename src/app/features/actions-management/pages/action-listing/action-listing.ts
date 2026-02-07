import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ActionService } from '../../services/action.service';
import { ActionResponse } from '../../models/ActionResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ActionListingTableComponent } from '../../components/action-listing-table/action-listing-table.component';

@Component({
    selector: 'app-action-listing',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        DeletePopupComponent,
        ToasterComponent,
        LoaderComponent,
        ActionListingTableComponent
    ],
    templateUrl: './action-listing.html',
    styleUrl: './action-listing.css'
})
export class ActionListing implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    @ViewChild(ActionListingTableComponent) table!: ActionListingTableComponent;

    isDeletePopupOpen = false;
    pendingDeleteId?: number;
    loading = false;

    constructor(private actionService: ActionService, private router: Router) { }

    ngOnInit() {
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
                    this.isDeletePopupOpen = false;
                    this.loading = false;
                    this.toaster?.show('Action deleted successfully.', 'success');
                    this.table.loadActions();
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
