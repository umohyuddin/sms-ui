import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-type-listing-table',
  standalone: true,
  imports: [],
  templateUrl: './employee-type-listing-table.component.html',
  styleUrl: './employee-type-listing-table.component.css'
})
export class EmployeeTypeListingTableComponent {
  pagination: Pagination<FeeCatalogResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  feeCatalogResponse: FeeCatalogResponse[] = [];
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private feeCatalogManagementService: FeeCatalogManagementService,
  ) { }

  columns = [
    { key: 'feeCatalogName', label: 'Fee Catalog Name', sortable: true },
    { key: 'feeCatalogCode', label: 'Fee Catalog Code', sortable: true },
    { key: 'chargeType', label: 'Charge Type', sortable: true },
    { key: 'recurrenceRule', label: 'Recurrence Rule', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.getFeeCatalogs();
    this.SubscribeToSearch();
  }

  private SubscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.feeCatalogManagementService.searchFeeCatalogs(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.feeCatalogResponse = response.body;
          this.pagination = new Pagination(this.feeCatalogResponse, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  getFeeCatalogs() {
    this.feeCatalogManagementService.getAllFeeCatalogs().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogResponse = response.body;
        this.pagination = new Pagination(this.feeCatalogResponse, 10);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    })
  }

  viewDetails(item: FeeCatalogResponse, event: Event): void {
    console.log('Viewing details for Resoruce ID:', item.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.DETAILS(item.id.toString()));
  }

  editDetails(item: FeeCatalogResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Resoruce ID:', item.id);
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.EDIT(item.id.toString()));
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}
