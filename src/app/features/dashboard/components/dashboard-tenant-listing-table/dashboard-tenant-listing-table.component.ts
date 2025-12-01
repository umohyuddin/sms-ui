import { Component, Input, SimpleChanges } from '@angular/core';
import { Tenant } from '../../../tenant-management/models/tenant';
import { Router } from '@angular/router';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard-tenant-listing-table',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule],
  templateUrl: './dashboard-tenant-listing-table.component.html',
  styleUrl: './dashboard-tenant-listing-table.component.css'
})
export class DashboardTenantListingTableComponent {
  @Input() tenantData: Tenant[] = [];
  URL = '';
  selectedRange = 'This month';
  filteredTenants: Tenant[] = [];

  constructor(private router: Router,
    private httpClientService: HttpClientService,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;
    this.filterData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['tenantData']) {
      this.filterData();
    }
  }

  filterData() {
    console.log("filter data")
    if (!this.tenantData || this.tenantData.length === 0) {
      this.filteredTenants = [];
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.filteredTenants = this.tenantData.filter((tenant) => {
      if (!tenant.createdAt) {
        console.warn('Skipping tenant because updatedAt is missing:', tenant);
        return false;
      }
      const date = new Date(tenant.createdAt);

      switch (this.selectedRange) {
        case 'This month':
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;

        case 'Last month':
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const yearForLastMonth = currentMonth === 0 ? currentYear - 1 : currentYear;
          return date.getMonth() === lastMonth && date.getFullYear() === yearForLastMonth;

        case 'This year':
          return date.getFullYear() === currentYear;

        case 'Custom range':
          // Extend later if you want to open a date picker
          return true;

        default:
          return true;
      }
    });
  }
  columns = [
    // { key: 'id', label: 'Id', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdBy', label: 'Created by', sortable: false },
    { key: 'updatedBy', label: 'Updated by', sortable: false },
    { key: 'updatedAt', label: 'Updated at', sortable: true },
    { key: 'expiryDate', label: 'Expiry Date', sortable: true },
  ];
}

