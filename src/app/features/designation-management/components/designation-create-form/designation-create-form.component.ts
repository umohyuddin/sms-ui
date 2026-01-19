import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeeCatalogResponse } from '../../../fee-catalog-management/models/FeeCatalogResponse';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { FeeCatalogManagementService } from '../../../fee-catalog-management/services/fee-catalog-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { EmployeeTypeService } from '../../../employee-type-management/services/employee-type.service';
import { DepartmentManagementService } from '../../../department-management/services/DepartmentManagementService';
import { EmployeeTypeResponse } from '../../../employee-type-management/models/EmployeeTypeResponse';
import { DepartmentResponse } from '../../../department-management/models/DepartmentResponse';
import { DesignationManagementService } from '../../services/designationManagement.service';

@Component({
  selector: 'app-designation-create-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './designation-create-form.component.html',
  styleUrl: './designation-create-form.component.css'
})
export class DesignationCreateFormComponent {

  createForm!: FormGroup;
  routedId: string | null = null;
  isEditMode = false;

  employeeTypes: EmployeeTypeResponse[] = [];
  employeeTypeDD: KeyValueOption[] = [];

  departments: DepartmentResponse[] = [];
  departmentDD: KeyValueOption[] = [];

  private readonly MODULE = 'Designation';
  private readonly COMPONENT = 'DesignationForm';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeTypeService: EmployeeTypeService,
    private departmentService: DepartmentManagementService,
    private designationService: DesignationManagementService
  ) { }

  ngOnInit(): void {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing component');

    this.initializeForm();
    this.loadEmployeeTypes();
    this.loadDepartments();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode && this.routedId) {
      this.getDesignationDetails(this.routedId);
    }

    LoggerUtil.groupEnd();
  }

  private initializeForm(): void {
    this.createForm = this.fb.group({
      designationName: ['', [Validators.required, this.noWhitespaceValidator]],
      designationCode: ['', [Validators.maxLength(20), this.noWhitespaceValidator]],
      active: [true],
      departmentId: [''],
      employeeTypeId: ['', Validators.required],
      description: ['', [Validators.maxLength(500), this.noWhitespaceValidator]]
    });
  }

  private loadEmployeeTypes(): void {
    this.employeeTypeService.getAllEmployeeType().subscribe({
      next: res => {
        this.employeeTypes = res.body ?? [];
        this.employeeTypeDD = this.employeeTypes.map(e => ({
          key: e.id.toString(),
          label: e.name
        }));
      },
      error: err => LoggerUtil.error(this.MODULE, 'EmployeeType', '❌ Failed to load', err)
    });
  }

  private loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: res => {
        this.departments = res.body ?? [];
        this.departmentDD = this.departments.map(d => ({
          key: d.id.toString(),
          label: d.departmentName
        }));
      },
      error: err => LoggerUtil.error(this.MODULE, 'Department', '❌ Failed to load', err)
    });
  }

  getDesignationDetails(id: string): void {
    this.designationService.getDesignationById(id).subscribe({
      next: res => {
        const data = res.body;
        if (data) {
          this.createForm.patchValue({
            designationName: data.designationName,
            designationCode: data.designationCode,
            active: data.active,
            departmentId: data.departmentId?.toString(),
            employeeTypeId: data.employeeTypeId?.toString(),
            description: data.description
          });
        }
      },
      error: err => LoggerUtil.error(this.MODULE, 'GetDetails', '❌ Failed', err)
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.createForm.getRawValue(),
      departmentId: Number(this.createForm.value.departmentId),
      employeeTypeId: Number(this.createForm.value.employeeTypeId)
    };

    this.designationService.saveDesignation(this.routedId,payload).subscribe({
      next: () => this.router.navigate(ROUTES.DESIGNATIONS.LIST),
      error: err => LoggerUtil.error(this.MODULE, 'Submit', '❌ Failed', err)
    });
  }

  goToDesignationList(): void {
    this.router.navigate(ROUTES.DESIGNATIONS.LIST);
  }

  // Validators
  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  // Form Getters
  get designationName() { return this.createForm.get('designationName'); }
  get designationCode() { return this.createForm.get('designationCode'); }
  get departmentId() { return this.createForm.get('departmentId'); }
  get employeeTypeId() { return this.createForm.get('employeeTypeId'); }
  get description() { return this.createForm.get('description'); }
  get isActive() { return this.createForm.get('isActive'); }
}
