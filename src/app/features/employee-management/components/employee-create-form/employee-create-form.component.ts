import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { DepartmentManagementService } from '../../../department-management/services/DepartmentManagementService';
import { DepartmentResponse } from '../../../department-management/models/DepartmentResponse';
import { DesignationManagementService } from '../../../designation-management/services/designationManagement.service';
import { DesignationResponse } from '../../../designation-management/components/models/DesignationResponse';
import { UserRoleAssignmentComponent } from '../../../roles-management/components/user-role-assignment/user-role-assignment.component';
import { RolesService } from '../../../roles-management/services/roles.service';
import { LoggerService } from '../../../../core/services/logger.service';


interface EmployeeStep {
  title: string;
  formGroup?: FormGroup;      // if this step has its own form
  completed: boolean;         // has this step been completed?
  action: (...args: any[]) => void; // Function to call when saving this step
  templateRef?: any;
}


@Component({
  selector: 'app-employee-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    UserRoleAssignmentComponent
  ],
  templateUrl: './employee-create-form.component.html',
  styleUrls: ['./employee-create-form.component.css']
})
export class EmployeeCreateFormComponent implements OnInit {
  steps: EmployeeStep[] = [];
  currentStepIndex = 0;
  createForm!: FormGroup;
  departmentForm!: FormGroup;
  designationForm!: FormGroup;
  response?: EmployeeResponse;
  selectedRoleIds: number[] = [];

  // Dynamic dropdowns
  docsTypeDD: KeyValueOption[] = [];
  genderDD: KeyValueOption[] = [];
  maritalStatusDD: KeyValueOption[] = [];
  bloodGroupDD: KeyValueOption[] = [];
  religionDD: KeyValueOption[] = [];
  departmentDD: KeyValueOption[] = [];
  designationDD: KeyValueOption[] = [];

  departments: DepartmentResponse[] = [];
  designations: DesignationResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeManagementSerivce: EmployeeManagementService,
    private departmentService: DepartmentManagementService,
    private designationService: DesignationManagementService,
    private rolesService: RolesService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.initializeForm();

    this.steps = [
      {
        title: 'Employee Details',
        formGroup: this.createForm,
        completed: false,
        action: this.onEmployeeSubmit.bind(this)
      },
      {
        title: 'Assign Department',
        formGroup: this.departmentForm,
        completed: false,
        action: this.saveDepartment.bind(this)
      },
      {
        title: 'Assign Designation',
        formGroup: this.designationForm,
        completed: false,
        action: this.saveDesignation.bind(this)
      },
      {
        title: 'Assign Roles',
        completed: false,
        action: this.saveRoles.bind(this)
      }
    ];
    this.steps.forEach((step, index) => {
      if (step.formGroup) {
        if (index === 0) step.formGroup.enable();
        else step.formGroup.disable();
      }
    });
    this.employeeLookUpData();
    this.getDepartments();
    //this.createForm.patchValue(this.dummyData);
  }

  private initializeForm() {
    const today = new Date();
    this.createForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      fullName: [''],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      primaryPhone: ['', Validators.required],
      secondaryPhone: [''],
      workPhone: [''],
      email: ['', Validators.required],
      religion: ['', Validators.required],
      // nationality: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      bloodGroup: [''],
      bio: [],
      joiningDate: [today, Validators.required],
    });

    this.departmentForm = this.fb.group({
      departmentId: ['', Validators.required]
    });

    this.designationForm = this.fb.group({
      designationId: ['', Validators.required]
    });

    this.departmentForm.disable();
    this.designationForm.disable();

  }


  checkInvalidFields() {
    const invalid: string[] = [];
    const controls = this.createForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        this.logger.debug(`${name} is invalid`, controls[name].errors);
      }
    }
    return invalid;
  }

  private employeeLookUpData() {
    this.logger.group('📦 Fetching Employee Lookup Data');
    this.employeeManagementSerivce.getDocsMeta()
      .subscribe({
        next: (response) => {
          this.logger.success('Lookup data loaded', {
            status: response.status,
            body: response.body
          });
          //converts an object into an array of key–value pairs.
          this.docsTypeDD = SmsUtil.mapToKeyValue(response.body.docs);
          this.genderDD = SmsUtil.mapToKeyValue(response.body.gender);
          this.maritalStatusDD = SmsUtil.mapToKeyValue(response.body.maritalStatus);
          this.bloodGroupDD = SmsUtil.mapToKeyValue(response.body.bloodGroup);
          this.religionDD = SmsUtil.mapToKeyValue(response.body.religions);
        },
        error: (error) => {
          this.logger.error('Failed to load lookup data', {
            status: error.status,
            message: error.message
          });
        },
        complete: () => {
          this.logger.complete('Request Complete');
          this.logger.groupEnd();
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
        this.logger.success(`Loaded ${this.departments.length} departments`);
      },
      error: error => this.logger.error('Failed to load departments', error)
    });
  }

  onEmployeeSubmit(): void {
    // Construct fullName before submitting
    this.createForm.get('fullName')?.setValue(
      `${this.createForm.get('firstName')?.value} ${this.createForm.get('middleName')?.value || ''} ${this.createForm.get('lastName')?.value}`.trim()
    );

    this.logger.group('➡️ Submitting Employee Form');
    this.logger.info('Form Data:', this.createForm.getRawValue());

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.logger.warn('Employee form is invalid', {
        invalidControls: this.getInvalidControls(),
        formValue: this.createForm.getRawValue()
      });
      return;
    }
    if (this.currentStep.formGroup) this.currentStep.formGroup.enable();
    this.employeeManagementSerivce.save(this.createForm.getRawValue())
      .subscribe({
        next: (response) => {
          this.logger.success('Employee saved successfully', {
            status: response.status,
            employee: response.body
          });
          this.response = response.body
          this.createForm.disable();            // disable current step
          this.currentStep.completed = true;     // mark step completed
          this.nextStep();
          if (this.currentStep.formGroup) this.currentStep.formGroup.enable();
        },
        error: (error) => {
          this.logger.error('Failed to save employee', {
            status: error.status,
            message: error.message,
            formData: this.createForm.getRawValue()
          });
        },
        complete: () => {
          this.logger.complete('Employee form submission complete');
          this.logger.groupEnd();
        }
      })
  }

  saveDepartment() {
    if (!this.response?.id) return this.logger.error('Employee ID missing');

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const payload = {
      employeeId: this.response.id,
      departmentId: Number(this.departmentForm.value.departmentId),
      createdBy: 1
    };

    this.departmentService.assignDepartment(payload).subscribe({
      next: (res) => {
        this.logger.success('Department assigned', res.body);
        this.currentStep.completed = true;  // mark step completed
        this.loadDesignationsByDepartment(payload.departmentId); // preload designations
        this.nextStep();                     // enable next step form
      },
      error: (err) => this.logger.error('Failed to assign department', err)
    });
  }


  private loadDesignationsByDepartment(departmentId: number) {
    this.designationService.getDesignationsByDepartment(departmentId).subscribe({
      next: response => {
        this.designations = response.body;
        this.designationDD = this.designations.map(d => ({
          key: d.id.toString(),
          label: d.designationName
        }));
        this.logger.success(`Loaded ${this.designations.length} designations for department ID ${departmentId}`);
      },
      error: error => this.logger.error('Failed to load designations', error)
    });
  }

  saveDesignation() {
    if (!this.response?.id) return this.logger.error('Employee ID missing');

    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      return;
    }

    const payload = {
      employeeId: this.response.id,
      designationId: Number(this.designationForm.value.designationId),
      departmentId: Number(this.departmentForm.value.departmentId),
      createdBy: 1
    };

    this.designationService.assignDesignation(payload).subscribe({
      next: (res) => {
        this.logger.success('Designation assigned', res.body);
        this.currentStep.completed = true;
        this.nextStep();
        this.router.navigate(ROUTES.EMPLOYEE.LIST) // move to next step if exists
      },
      error: (err) => this.logger.error('Failed to assign designation', err)
    });
  }


  onRolesChanged(roleIds: number[]) {
    this.selectedRoleIds = roleIds;
  }

  saveRoles() {
    if (!this.response?.id) return this.logger.error('Employee ID missing');

    this.rolesService.assignRolesToUser(this.response.id, this.selectedRoleIds).subscribe({
      next: (res) => {
        this.logger.success('Roles assigned', res.body);
        this.currentStep.completed = true;
        this.router.navigate(ROUTES.EMPLOYEE.LIST);
      },
      error: (err) => this.logger.error('Failed to assign roles', err)
    });
  }

  get currentStep(): EmployeeStep {
    return this.steps[this.currentStepIndex];
  }

  goToEmployeeList(): void {
    this.router.navigate(ROUTES.EMPLOYEE.LIST);
  }


  nextStep() {
    // Disable current step's form
    const currentForm = this.currentStep.formGroup;
    if (currentForm) currentForm.disable();

    // Move to next step if available
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }

    // Enable the next step's form
    const nextForm = this.currentStep.formGroup;
    if (nextForm) nextForm.enable();
  }

  goToEmployeeDetail(id: string) {
    this.router.navigate(ROUTES.EMPLOYEE.DETAILS(id.toString()))
  }


  private getInvalidControls(): string[] {
    const invalid: string[] = [];
    const controls = this.createForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  //getters
  get firstName() { return this.createForm.get('firstName'); }
  get lastName() { return this.createForm.get('lastName'); }
  get middleName() { return this.createForm.get('middleName'); }
  get fullName() { return this.createForm.get('fullName'); }
  get dateOfBirth() { return this.createForm.get('dateOfBirth'); }
  get gender() { return this.createForm.get('gender'); }
  get passportNumber() { return this.createForm.get('passportNumber'); }
  get primaryPhone() { return this.createForm.get('primaryPhone'); }
  get secondaryPhone() { return this.createForm.get('secondaryPhone'); }
  get workPhone() { return this.createForm.get('workPhone'); }
  get email() { return this.createForm.get('email'); }
  get religion() { return this.createForm.get('religion'); }
  get nationality() { return this.createForm.get('nationality'); }
  get bloodGroup() { return this.createForm.get('bloodGroup'); }
  get bio() { return this.createForm.get('bio'); }
  get joiningDate() { return this.createForm.get('joiningDate'); }
  get maritalStatus() { return this.createForm.get("maritalStatus"); }

  dummyData = {
    firstName: 'Uzair',
    lastName: 'Anwar',
    middleName: 'Ali',
    fullName: 'Uzair Ali Anwar',
    dateOfBirth: '1990-05-12',
    gender: 'MALE',
    primaryPhone: '03001234567',
    secondaryPhone: '03007654321',
    workPhone: '02112345678',
    email: 'uzair.anwar@example.com',
    religion: 'ISLAM',
    nationality: 'Pakistan',
    bloodGroup: 'O_POSITIVE',
    bio: 'Software engineer with 5 years of experience',
    joiningDate: '2022-01-15',
    maritalStatus: 'SINGLE'
  };

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createForm.get(controlName) ||
      this.departmentForm.get(controlName) ||
      this.designationForm.get(controlName);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }



  validationMessages = {
    firstName: {
      required: 'First Name is required.'
    },
    lastName: {
      required: 'Last Name is required.'
    },
    dateOfBirth: {
      required: 'Date of Birth is required.'
    },
    gender: {
      required: 'Gender is required.'
    },
    primaryPhone: {
      required: 'Primary Phone is required.'
    },
    email: {
      required: 'Email is required.',
      email: 'Email must be valid.'
    },
    religion: {
      required: 'Religion is required.'
    },
    nationality: {
      required: 'Nationality is required.'
    },
    maritalStatus: {
      required: 'Marital Status is required.'
    },
    joiningDate: {
      required: 'Joining Date is required.'
    },
    departmentId: {
      required: 'Department is required.'
    },
    designationId: {
      required: 'Designation is required.'
    }
  };

}
