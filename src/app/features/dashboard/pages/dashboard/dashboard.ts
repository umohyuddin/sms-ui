import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { Tenant } from '../../../tenant-management/models/tenant';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { DashboardTenantListingTableComponent } from '../../components/dashboard-tenant-listing-table/dashboard-tenant-listing-table.component';
import { DashboardHeaderStatsComponent } from '../../components/dashboard-header-stats/dashboard-header-stats.component';
import { TenantDataService } from '../../../../core/services/tenant-data.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,
    DashboardTenantListingTableComponent,
    DashboardHeaderStatsComponent,
    CommonModule,
    LoaderComponent,
    // NgxChartsModule,
    MatSelectModule,
    MatCardModule,
    NgxChartsModule
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  selectedPeriod = 'This month';
  selectedRange = 'This month';
  selectedTab: string = 'new';
  tenants: Tenant[] = [];
  activeCount: number = 0;
  inactiveCount: number = 0;
  spinner = true;
// Donut Chart Data
  totalTenants = [
    { name: 'Active', value: 0 },
    { name: 'Inactive', value: 0 }
  ];

  URL = '';
  constructor(private httpClientService: HttpClientService,
    private router: Router,
    private appConfig: AppConfigService,
    private tenantDataService: TenantDataService
  ) { }

  ngOnInit(): void {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;
    this.tenantListing();
  }

  private tenantListing() {
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, this.URL, { observeResponse: true })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('✅ Status:', response.status);
          console.log('📦 Body:', response.body);
          this.tenants = response.body || [];
          // this.tenants = (response.body || []).map((tenant: any) => ({
          //   ...tenant,
          //   createdAt: this.getCurrentMonthDate()
          // }));


          this.calculateDonutCounts();
          this.chartData = this.generateMonthlyData(this.tenants);
        
          this.tenantDataService.setTenants(this.tenants)
          console.log('Tenants List:', this.tenants);
        },
        error: (error) => {
          console.error('❌ Error Status:', error.status);
          console.error('Message:', error.message);
          this.spinner = false;
        }, complete: () => {
          console.log('🔚 Complete');
          this.spinner = false;
        }
      });
  }


  colorScheme: Color = {
    name: 'tenantScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#000000', '#92BFFF'], // exact black + soft blue
  };

  barColorScheme: Color = {
    name: 'barScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#AFCBFF'],
  };

  

  // Bar Chart Data
  newTenantsData = [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 20 },
    { name: 'Mar', value: 15 },
    { name: 'Apr', value: 21 },
    { name: 'May', value: 9 },
    { name: 'Jun', value: 17 }
  ];

  leftTenantsData = [
    { name: 'Jan', value: 5 },
    { name: 'Feb', value: 7 },
    { name: 'Mar', value: 4 },
    { name: 'Apr', value: 10 },
    { name: 'May', value: 3 },
    { name: 'Jun', value: 8 }
  ];

  chartData = this.newTenantsData;

  private calculateDonutCounts() {
    // Calculate counts
    this.activeCount = this.tenants.filter(
      (tenant: any) => tenant.status === 'active'
    ).length;

    this.inactiveCount = this.tenants.filter(
      (tenant: any) => tenant.status === 'inActive'
    ).length;

    console.log('🟢 Active Tenants:', this.activeCount);
    console.log('🔴 Inactive Tenants:', this.inactiveCount);

    this.totalTenants = [
      { name: 'Active', value: this.activeCount },
      { name: 'Inactive', value: this.inactiveCount }
    ];
  }

  onTabChange(tab: string): void {
    console.log('Tab changed to:', tab);
    this.selectedTab = tab;
    this.chartData = tab === 'new' ? this.newTenantsData : this.leftTenantsData;
  }

  private generateMonthlyData(tenants: any[]): { name: string; value: number }[] {
  const monthlyCounts: Record<string, number> = {};

  tenants.forEach((tenant) => {
    if (tenant.createdAt) {
      const date = new Date(tenant.createdAt);
      const month = date.toLocaleString('default', { month: 'short' }); // Jan, Feb, etc.
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    }
  });

  // Order months properly
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthOrder.map((m) => ({
    name: m,
    value: monthlyCounts[m] || 0
  }));
}


  private getCurrentMonthDate(): string {
    const now = new Date();
    const randomDay = Math.floor(Math.random() * now.getDate()) + 1; // random day up to today
    const date = new Date(now.getFullYear(), now.getMonth(), randomDay);
    return date.toISOString(); // "2025-11-04T00:00:00.000Z"
  }
  formatYAxis(value: number): string {
  return `${value * 10}`;
}
}
