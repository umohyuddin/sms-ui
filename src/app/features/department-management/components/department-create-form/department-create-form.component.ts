import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { DepartmentResponse } from '../../models/DepartmentResponse';
import { DepartmentManagementService } from '../../services/DepartmentManagementService';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { EmployeeManagementService } from '../../../employee-management/services/employee-management.service';
@Component({
  selector: 'app-department-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './department-create-form.component.html',
  styleUrl: './department-create-form.component.css'
})
export class DepartmentCreateFormComponent {
  departmentDD: KeyValueOption[] = [];
  responseData?: DepartmentResponse
  createForm!: FormGroup;
  routeCampusId?: string;
  URL = '';
  isEditMode = false;
  routedId: string | null = null;
  showProvinceDropdown: boolean = false;
  filteredProvinces: any[] = [];
  filteredData: any[] = [];
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();


  schools = [
    { id: 1, name: 'School A' },
    { id: 2, name: 'School B' },
    { id: 3, name: 'School C' }
  ];

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentManagementService: DepartmentManagementService,
    private employeeManagementSerivce: EmployeeManagementService

  ) { }

  ngOnInit() {
    this.getAllDepartments()
    this.initializeForm();

    this.initSearch();
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routedId);
      this.getDepartmentDetails(this.routedId!);
    } else {
      console.log('Create Mode Activated');
    }
  }
  private initSearch(): void {
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(query => {
          if (query.length < 2) {
            this.filteredData = [];
            return [];
          }
          return this.employeeManagementSerivce.searchEmployee(query);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          this.filteredData = res?.body || [];
        },
        error: () => {
          this.filteredData = [];
        }
      });
  }

  private initializeForm() {
    this.createForm = this.fb.group({
      departmentName: ['', [Validators.required]],
      departmentCode: [''],
      parentDepartmentId: [''],               // Optional (parent department)
      headEmployeeId: [null],          // Optional (can be assigned later)
      description: ['', Validators.maxLength(255)],
      active: [true]
    });
  }


  goToCampusList(): void {
    this.router.navigate(ROUTES.DEPARTMENTS.LIST);
  }
  onSubmit(): void {
    console.log('  Campus Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.departmentManagementService.saveDepartment(this.routedId, this.createForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(ROUTES.CAMPUS.LIST);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }


  getAllDepartments(): void {
    this.departmentManagementService.getAllDepartments().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.responseData = response.body;
        this.departmentDD = response.body.map((item: any) => ({
          key: item.id,
          label: item.departmentName
        }));

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
  getDepartmentDetails(departmentId: string): void {
    this.departmentManagementService.getDepartmentById(departmentId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.responseData = response.body;
        if (this.responseData) {
          this.createForm.patchValue(this.responseData);
        }

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

  goToDepartmentListing() {
    this.router.navigate(ROUTES.DEPARTMENTS.LIST)
  }



  //getters

  get departmentName() {
    return this.createForm.get('departmentName');
  }

  get departmentCode() {
    return this.createForm.get('departmentCode');
  }

  get parentDepartmentId() {
    return this.createForm.get('parentDepartmentId');
  }

  get headEmployeeId() {
    return this.createForm.get('headEmployeeId');
  }
  get description() {
    return this.createForm.get('description');
  }
  get active() {
    return this.createForm.get('active');
  }



  dropdownOpen = false;

  campuses = [
    { id: 1, campusName: 'Main Campus' },
    { id: 2, campusName: 'City Campus' },
    { id: 3, campusName: 'North Campus' }
  ];

  filteredCampuses = [...this.campuses];
  selectedCampus: any = null;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.filteredCampuses = [...this.campuses];
  }

  filterCampuses(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCampuses = this.campuses.filter(c =>
      c.campusName.toLowerCase().includes(value)
    );
  }

  selectCampus(campus: any): void {
    this.selectedCampus = campus;
    this.dropdownOpen = false;
  }
  searchText: string = '';
  data: string[] = ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'];

  filterData() {
    const search = this.searchText.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.toLowerCase().includes(search)
    );
  }

  selectItem(item: string) {
    this.searchText = item;
    this.filteredData = []; // hide dropdown after selection
  }
}