import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatSelectModule } from '@angular/material/select';
import { TenantListingTableComponent } from '../../components/tenant-listing-table/tenant-listing-table.component';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';

@Component({
  selector: 'app-tenant-listing',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    NgxChartsModule, MatSelectModule,
    TenantListingTableComponent
  ],
  templateUrl: './tenant-listing.html',
  styleUrls: ['./tenant-listing.css'],
  standalone: true,
})
export class TenantListing implements OnInit {
    spinner = true;
  selectedRange = 'This month';
  selectedPeriod = 'This month';
  selectedTab: string = 'new';




  @ViewChild(MatSort) sort!: MatSort;


  URL = '';
  constructor(private httpClientService: HttpClientService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;

    //this.tenantListing();
  }


  goToCreateTenant(): void {
    this.router.navigate(['/tenants/tenant-create']);
  }
}


