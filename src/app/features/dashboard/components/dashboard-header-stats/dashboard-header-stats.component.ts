import { Component, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantDataService } from '../../../../core/services/tenant-data.service';
import { Tenant } from '../../../tenant-management/models/tenant';

@Component({
  selector: 'app-dashboard-header-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-header-stats.component.html',
  styleUrl: './dashboard-header-stats.component.css'
})
export class DashboardHeaderStatsComponent {

  filteredTenants: Tenant[] = [];
  totalTenants: number = 0
  tenantData?: Tenant[]
  selectedRange = 'This month';
  constructor(private tenantDataService: TenantDataService) { }

  ngOnInit() {
    this.tenantDataService.tenants$.subscribe((tenants) => {
      this.tenantData = tenants;
      this.filterData();
    });
  }



  filterData() {
    if (!this.tenantData || this.tenantData.length === 0) {
      this.filteredTenants = [];
      this.totalTenants = 0;
      console.log("⚠️ No tenants to filter");
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Determine start/end of current and last week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start of week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfWeek);
    endOfLastWeek.setDate(startOfWeek.getDate() - 1);

    this.filteredTenants = this.tenantData.filter((tenant) => {
      if (!tenant.updatedAt) {
        console.warn('Skipping tenant with missing updatedAt:', tenant);
        return false;
      }

      const date = new Date(tenant.createdAt);

      switch (this.selectedRange) {
        case 'This week':
          return date >= startOfWeek && date <= endOfWeek;

        case 'Last week':
          return date >= startOfLastWeek && date <= endOfLastWeek;

        case 'This month':
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;

        case 'Last month':
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const yearForLastMonth = currentMonth === 0 ? currentYear - 1 : currentYear;
          return date.getMonth() === lastMonth && date.getFullYear() === yearForLastMonth;

        default:
          return true;
      }
    });

    this.totalTenants = this.filteredTenants.length;
    console.log("✅ Filtered tenant count:", this.totalTenants);
  }  
}


