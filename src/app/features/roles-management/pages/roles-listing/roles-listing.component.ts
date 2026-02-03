import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RolesListingTableComponent } from '../../components/roles-listing-table/roles-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-roles-listing',
  standalone: true,
  imports: [CommonModule, RolesListingTableComponent],
  templateUrl: './roles-listing.component.html',
  styleUrl: './roles-listing.component.css'
})
export class RolesListingComponent {
  constructor(private router: Router) {}

  goToCreateRole(): void {
    this.router.navigate(ROUTES.ROLES.CREATE);
  }
}
