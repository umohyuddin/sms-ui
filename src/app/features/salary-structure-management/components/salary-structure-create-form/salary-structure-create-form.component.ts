import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalaryStructureResponse } from '../../models/SalaryStructureResponse';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { SalaryStructureService } from '../../services/salary-structure.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { EmployeeTypeService } from '../../../employee-type-management/services/employee-type.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-salary-structure-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salary-structure-create-form.component.html',
  styleUrl: './salary-structure-create-form.component.css'
})
export class SalaryStructureCreateFormComponent {
  createForm!: FormGroup;
  routedId: string | null = null;
  URL = '';
  mode = '';
  responseData?: SalaryStructureResponse;
  employeeTypesDD: KeyValueOption[] = [];
  isEditMode: boolean = false;
  fieldToEdit = ''

  private readonly MODULE = 'Salary';
  private readonly COMPONENT = 'Structure';
  constructor(
    private salaryStructureService: SalaryStructureService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfigService
  , private logger: LoggerService) { }


  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, 'Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');


    const fieldToEdit = this.route.snapshot.queryParamMap.get('field');
    if (fieldToEdit) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, 'Field to focus/edit', fieldToEdit);
      this.fieldToEdit = fieldToEdit; // save for later use
    }
    this.initializeForm();
    this.loadEmployeeTypes();

    if (this.isEditMode && this.routedId) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, 'Edit Mode: Loading Salary Structrue details for', this.routedId);
      this.getSalaryStructureDetails(this.routedId);
    }
    LoggerUtil.groupEnd();
  }
  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createForm = this.fb.group({
      employeeTypeId: ['', Validators.required],
      baseSalary: ['', [Validators.required, Validators.min(0.01)]],
      effectiveFrom: ['', Validators.required],
      effectiveTo: ['']
    });
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized', this.createForm.value);
    LoggerUtil.groupEnd();
  }





  private loadEmployeeTypes() {
    LoggerUtil.group(`🏫 [${this.MODULE}] Load Employee types`);
    this.employeeTypesDD = this.appConfig.systemEmployeeType;
  }

  getSalaryStructureDetails(salaryStructureId: string) {
  LoggerUtil.group(`📌 [${this.MODULE}] Load Salary Structure Details`);
  this.salaryStructureService.getSalaryStructureById(salaryStructureId).subscribe({
    next: (response) => {
      LoggerUtil.log(this.MODULE, 'Details', '✅ Salary Structure data loaded', response.body);
      this.responseData = response.body;

      this.createForm.patchValue({
        employeeTypeId: this.responseData?.employeeTypeId,
        baseSalary: this.responseData?.baseSalary,
        effectiveFrom: this.responseData?.effectiveFrom,
        effectiveTo: this.responseData?.effectiveTo,
      });

      // Handle field-level edit: disable all except the one we want
      if (this.fieldToEdit) {
        Object.keys(this.createForm.controls).forEach((key) => {
          if (key !== this.fieldToEdit) {
            this.createForm.get(key)?.disable(); // disable all except the selected field
          } else {
            this.createForm.get(key)?.enable(); // ensure editable field is enabled
          }
        });

        // Optional: focus on the editable field
        const el = document.getElementById(this.fieldToEdit);
        if (el) el.focus();
      }
    },
    error: (error) => LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load Salary Structure', error),
    complete: () => LoggerUtil.groupEnd()
  });
}


  onSubmit() {
    LoggerUtil.group(`🚀 [${this.MODULE}] Form Submit`);
    if (this.createForm.invalid) {
      LoggerUtil.warn(this.MODULE, 'Submit', '❌ Form invalid');
      this.createForm.markAllAsTouched();
      LoggerUtil.groupEnd();
      return;
    }

    LoggerUtil.log(this.MODULE, 'Submit', '📤 Submitting form', this.createForm.getRawValue());
    this.salaryStructureService.saveSalaryStructure(this.routedId, this.createForm.getRawValue())
      .subscribe({
        next: (response) => {
          LoggerUtil.log(this.MODULE, 'Submit', '✅ Section saved successfully', response.body);
          this.router.navigate(ROUTES.SALARY_STRUCTURE.LIST);
        },
        error: (error) => LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', error),
        complete: () => LoggerUtil.groupEnd()
      });
  }

  goToSalaryStructureList() {
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to sections list');
    this.router.navigate(ROUTES.SALARY_STRUCTURE.LIST);
  }

  // Validators
  noWhitespaceValidator(control: any) {
    return control.value && !control.value.trim() ? { whitespace: true } : null;
  }

  // Getters for template
  get employeeTypeId() { return this.createForm.get('employeeTypeId'); }
  get baseSalary() { return this.createForm.get('baseSalary'); }
  get effectiveFrom() { return this.createForm.get('effectiveFrom'); }
  get effectiveTo() { return this.createForm.get('effectiveTo'); }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }
    return '';
  }

  validationMessages = {
    employeeTypeId: {
      required: 'Employee Type is required.'
    },
    baseSalary: {
      required: 'Base Salary is required.',
      min: 'Base Salary must be a positive number.'
    },
    effectiveFrom: {
      required: 'Effective From date is required.'
    },
    effectiveTo: {
      // optional field, so usually no validation messages
    }
  };
}
