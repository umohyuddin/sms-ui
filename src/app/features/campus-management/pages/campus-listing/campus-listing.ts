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

import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { HttpResponse } from '@angular/common/http';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { CampusListingTableComponent } from '../../components/campus-listing-table/campus-listing-table.component';
import { CampusResponse } from '../../models/campusResponse';


@Component({
  selector: 'app-Campus-listing',
  imports: [

    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    NgxChartsModule,
     MatSelectModule,
     CampusListingTableComponent
  ],
  templateUrl: './Campus-listing.html',
  styleUrls: ['./Campus-listing.css'],
  standalone: true,
})
export class CampusListing implements OnInit {
  Campuss: CampusResponse[] = [];
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

    //this.CampusListing();
  }

  private CampusListing() {
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, this.URL, { observeResponse: true })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('✅ Status:', response.status);
          console.log('📦 Body:', response.body);
          this.Campuss = response.body || [];
          console.log('Campuss List:', this.Campuss);
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

  goToCreateCampus(): void {
    this.router.navigate(['/campuses/campus-create']);
  }
}


