import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PermissionListingTableComponent } from '../../components/permission-listing-table/permission-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-permission-listing',
  standalone: true,
  imports: [CommonModule, PermissionListingTableComponent],
  templateUrl: './permission-listing.component.html',
  styleUrl: './permission-listing.component.css'
})
export class PermissionListingComponent {
  constructor(private router: Router) {}

  goToCreatePermission(): void {
    this.router.navigate(ROUTES.PERMISSIONS.CREATE);
  }
}
