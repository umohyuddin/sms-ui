import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { DepartmentResponse } from '../../../department-management/models/DepartmentResponse';
import { DepartmentManagementService } from '../../../department-management/services/DepartmentManagementService';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';
import { EmployeeDepartmentHistoryResponse } from '../../models/EmployeeDepartmentHistoryResponse';
import { DesignationManagementService } from '../../../designation-management/services/designationManagement.service';
import { EmployeeDesignationHistoryResponseDTO } from '../../../designation-management/components/models/EmployeeDesignationHistoryResponseDTO';

@Component({
  selector: 'app-employee-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-department.component.html',
  styleUrl: './employee-department.component.css'
})
export class EmployeeDepartmentComponent {
  currentStepIndex = 0;
  departmentForm!: FormGroup;
  designationForm!: FormGroup;
  response?: EmployeeDepartmentHistoryResponse;
    employeeDesignationResponse?: EmployeeDesignationHistoryResponseDTO;
  designationDD: KeyValueOption[] = [];

  // Dynamic dropdowns
  departmentDD: KeyValueOption[] = [];

  departments: DepartmentResponse[] = [];
  routedId!: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeManagementSerivce: EmployeeManagementService,
    private departmentService: DepartmentManagementService,
    private designationService:DesignationManagementService
    //    private designationService: DesignationManagementService
  , private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('ID from route:', this.routedId);

    this.initializeForm();
    this.getDepartments();
      this.departmentForm.get('departmentId')?.valueChanges.subscribe(departmentId => {
    if (departmentId) {
      this.getDesignationsByDepartment(departmentId);
    } else {
      this.designationDD = [];
       this.departmentForm.get('designationId')?.reset();

    }
  });

  }

  private getDesignationsByDepartment(departmentId: string) {
  this.designationService.getDesignationsByDepartment(Number(departmentId)).subscribe({
    next: response => {
      const designations = response.body;

      this.designationDD = designations.map((d: any) => ({
        key: d.id.toString(),
        label: d.designationName
      }));

      // reset designation when department changes
      this.departmentForm.get('designationId')?.reset();
      this.getEmployeeDesignationDetails(this.routedId)
    },
    error: err => console.error('❌ Failed to load designations', err)
  });
}

  private initializeForm() {
    this.departmentForm = this.fb.group({
      departmentId: ['', Validators.required],
        designationId: ['', Validators.required],
      employeeId: [this.routedId, Validators.required] // Dropdown for department
    });
  }


  getEmployeeDepartmentDetails(routedId: string): void {
    this.employeeManagementSerivce.getEmployeeDepartment(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.response = response.body;

        this.departmentForm.patchValue({
          //employeeId: this.response?.id,
          departmentId: this.response?.departmentId?.toString() // convert to string for select
        });
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

  getEmployeeDesignationDetails(routedId: string): void {
    this.employeeManagementSerivce.getEmployeeDesignation(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.employeeDesignationResponse = response.body;

        this.departmentForm.patchValue({
          //employeeId: this.response?.id,
          designationId: this.employeeDesignationResponse?.designationId?.toString() // convert to string for select
        });
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


  private getDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: response => {
        this.departments = response.body;
        this.departmentDD = this.departments.map(d => ({
          key: d.id.toString(),
          label: d.departmentName // or whatever property contains the department name
        }));
        this.getEmployeeDepartmentDetails(this.routedId)
      },
      error: error => console.error('Request Error:', error)
    });
  }


  onSubmit() {
    if (!this.routedId) return console.error('❌ Employee ID missing');

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const payload = {
      employeeId: this.routedId,
      departmentId: this.departmentForm.value.departmentId,
      designationId: this.departmentForm.value.designationId,
      createdBy: 1
    };

    this.departmentService.assignDepartment(payload).subscribe({
      next: (res) => {
        console.info('✅ Department assigned', res.body);
        this.router.navigate(ROUTES.EMPLOYEE.LIST);
      },
      error: (err) => console.error('❌ Failed to assign department', err)
    });

        this.designationService.assignDesignation(payload).subscribe({
      next: (res) => {
        console.info('✅ Department assigned', res.body);
        this.router.navigate(ROUTES.EMPLOYEE.LIST);
      },
      error: (err) => console.error('❌ Failed to assign department', err)
    });
  }


  goToEmployeeList(): void {
    this.router.navigate(ROUTES.EMPLOYEE.LIST);
  }


  goToEmployeeDetail(id: string) {
    this.router.navigate(ROUTES.EMPLOYEE.DETAILS(id.toString()))
  }


  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.departmentForm.get(controlName) ||
      this.departmentForm.get(controlName) ||
      this.designationForm.get(controlName);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }

  get departmentId() {
    return this.departmentForm.get('departmentId');
  }
  get designationId() {
    return this.departmentForm.get('designationId');
  }

  validationMessages = {
    departmentId: {
      required: 'Department is required.'
    },
    designationId: {
      required: 'Designation is required.'
    },
    // email: {
    //   required: 'Email is required.',
    //   email: 'Email must be valid.'
    // },
    // religion: {
    //   required: 'Religion is required.'
    // },
    // nationality: {
    //   required: 'Nationality is required.'
    // },
    // maritalStatus: {
    //   required: 'Marital Status is required.'
    // },
    // joiningDate: {
    //   required: 'Joining Date is required.'
    // },
    // departmentId: {
    //   required: 'Department is required.'
    // },
    // designationId: {
    //   required: 'Designation is required.'
    // }
  };

}
