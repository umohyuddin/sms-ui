import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
@Component({
  selector: 'app-campus-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './Campus-listing-table.component.html',
  styleUrls: ['./Campus-listing-table.component.css']
})
export class CampusListingTableComponent {
pagination: Pagination<any> = new Pagination([], 10);
  searchControl = new FormControl('');
  campuses: any[] = [];
  URL = '';
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private httpClientService: HttpClientService,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;
    this.getCampuses();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.searchCampuses(search)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.campuses = response.body;
          this.pagination = new Pagination(this.campuses, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  getCampuses() {
    let requestUrl = `${this.URL}${API_ENDPOINTS.INSTITUTE.CAMPUSES.GET_ALL}`
    return this.httpClientService.request<any>(HTTP_METHOD.GET, requestUrl, { observeResponse: true }).subscribe(
      {
        next: (response) => {
          console.log('✅ Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.campuses = response.body;
          this.pagination = new Pagination(this.campuses, 10);

          //this.router.navigate(['/tenants']);
        },
        error: (error) => {
          console.error('❌ Request Error Status:', error.status);
          console.error('Message:', error.message);
          //this.router.navigate(['/tenants']);
        },
        complete: () => {
          console.log('🔚 Request Complete');
        }
      }
    )
  }

  searchCampuses(searchText: string | null) {
    const query = searchText?.trim() || '';
    const requestUrl = query === ''
      ? `${this.URL}${API_ENDPOINTS.INSTITUTE.CAMPUSES.GET_ALL}`
      : `${this.URL}${API_ENDPOINTS.INSTITUTE.CAMPUSES.SEARCH(query)}`;

    return this.httpClientService.request<any>(
      HTTP_METHOD.GET,
      requestUrl,
      { observeResponse: true }
    );
  }

  columns = [
    // { key: 'id', label: 'Id', sortable: true },
    { key: 'campusName', label: 'Campus Name', sortable: true },
    { key: 'campusCode', label: 'Campus Code', sortable: true },
    { key: 'contactNumber', label: 'Contact Number', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'website', label: 'Web Site', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  viewCampusDetails(campus: any, event: Event): void {
    console.log('Viewing details for Campus ID:', campus.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(['/campuses/campus-details', campus.id]);
  }

  editCampusDetails(campus: any, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Campus ID:', campus.campusId);
    this.router.navigate(['/campuses/campus-edit', campus.id]);


  }

  deleteCampus(CampusId: any, event: Event): void {
    event.stopPropagation();

    console.log('Deleting Campus:', CampusId);
    if (confirm('Are you sure you want to delete this Campus?')) {

      this.httpClientService.request<any>(HTTP_METHOD.DELETE, `${this.URL}/${CampusId}`, {
        observeResponse: true
      }).subscribe({
        next: (response) => {
          console.log('✅ Delete Success Status:', response.status);
          console.log('📦 Delete Response Body:', response.body);
          // this.CampusData = this.CampusData.filter(t => t.CampusId !== CampusId);
          console.log(`Campus ${CampusId} deleted successfully`);
        },
        error: (error) => {
          console.error('❌ Delete Error Status:', error.status);
          console.error('Message:', error.message);
        },
        complete: () => {
          console.log('🔚 Delete Complete');
        }
      })


    }

  }

 onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}
