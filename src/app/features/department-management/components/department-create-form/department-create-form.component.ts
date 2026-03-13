import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { DepartmentResponse } from '../../models/DepartmentResponse';
import { DepartmentManagementService } from '../../services/DepartmentManagementService';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { EmployeeManagementService } from '../../../employee-management/services/employee-management.service';
import { Pagination } from '../../../../core/pagar/pagination';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { LoggerService } from '../../../../core/services/logger.service';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
@Component({
  selector: 'app-department-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
  templateUrl: './department-create-form.component.html',
  styleUrl: './department-create-form.component.css'
})
export class DepartmentCreateFormComponent {
  private readonly MODULE = 'Department';
  private readonly COMPONENT = 'CreateForm';

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
  searchText: string = '';

  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  isLoading: boolean = false;
  loadingMessage: string = '';

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentManagementService: DepartmentManagementService,
    private employeeManagementSerivce: EmployeeManagementService,
    private logger: LoggerService

  ) { }

  ngOnInit() {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    this.getAllDepartments()
    this.initializeForm();
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');

    this.initSearch();
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    if (this.isEditMode) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, '🔹 Loading department details for', this.routedId);
      this.getDepartmentDetails(this.routedId!);
    }
    LoggerUtil.groupEnd();
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
      departmentCode: ['', [
        Validators.maxLength(20),
        this.noWhitespaceValidator
      ]],
      parentDepartmentId: [''],               // Optional (parent department)
      headEmployeeId: [null],                 // Optional (can be assigned later)
      description: ['', Validators.maxLength(255)],
      active: [true],
      employeeSearch: [''],
    });
  }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  validationMessages = {
    departmentName: {
      required: 'Department Name is required.'
    },
    departmentCode: {
      maxlength: 'Department Code cannot exceed 20 characters.',
      whitespace: 'Department Code cannot be empty or whitespace only.'
    },
    description: {
      maxlength: 'Description cannot exceed 255 characters.'
    }
  };

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createForm.markAllAsTouched();
      this.toaster?.show('Please fill all required fields correctly.', 'warning');
      console.warn('❌ Form is invalid');
      return;
    }

    const { employeeSearch, ...payload } = this.createForm.getRawValue();

    this.isLoading = true;
    this.loadingMessage = 'Saving department...';
    this.departmentManagementService.saveDepartment(this.routedId, payload).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        const message = this.isEditMode ? 'Department details updated successfully.' : 'Department added successfully.';
        this.toaster?.show(message, 'success');
        setTimeout(() => {
          this.router.navigate(ROUTES.DEPARTMENTS.LIST);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to save department.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    });
  }


  getAllDepartments(): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading departments...';
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
        this.toaster?.show('Failed to load departments.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        console.log('🔚 Request Complete');
        this.isLoading = false;
      }
    })
  }
  getDepartmentDetails(departmentId: string): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading department details...';
    this.departmentManagementService.getDepartmentById(departmentId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.responseData = response.body;
        if (this.responseData) {
          this.createForm.patchValue({
            departmentName: this.responseData.departmentName,
            departmentCode: this.responseData.departmentCode,
            parentDepartmentId: this.responseData.parentDepartmentId,
            headEmployeeId: this.responseData.headEmployeeId,
            description: this.responseData.description,
            active: this.responseData.active
          });
          if (this.responseData.headEmployeeCode && this.responseData.headEmployeeName) {
            this.createForm.patchValue({
              employeeSearch: `${this.responseData.headEmployeeCode} - ${this.responseData.headEmployeeName}`
            });
          }
        }

      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load department details.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        console.log('🔚 Request Complete');
        this.isLoading = false;
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
  onEmployeeSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  selectEmployee(emp: any): void {
    this.createForm.patchValue({
      headEmployeeId: emp.id,
      employeeSearch: `${emp.employeeCode} - ${emp.fullName}`
    });
    this.filteredData = [];
  }

}