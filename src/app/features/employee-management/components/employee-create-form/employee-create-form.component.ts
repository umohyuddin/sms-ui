import { Component } from '@angular/core';
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
    CommonModule],
  templateUrl: './employee-create-form.component.html',
  styleUrls: ['./employee-create-form.component.css']
})
export class EmployeeCreateFormComponent {
  steps: EmployeeStep[] = [];
  currentStepIndex = 0;
  createForm!: FormGroup;
  departmentForm!: FormGroup;
  designationForm!: FormGroup;
  response?: EmployeeResponse;
  docsTypeDD: KeyValueOption[] = [];
  nationalityDD: KeyValueOption[] = [];
  religionDD: KeyValueOption[] = [];
  bloodGroupDD: KeyValueOption[] = [];
  genderDD: KeyValueOption[] = [];
  maritalStatusDD: KeyValueOption[] = [];
  religionsDD: KeyValueOption[] = [];
  departmentDD: KeyValueOption[] = [];
  departments: DepartmentResponse[] = [];

  designationDD: KeyValueOption[] = [];
  designations: DesignationResponse[] = [];

  constructor(
    private employeeManagementSerivce: EmployeeManagementService,
    private departmentService: DepartmentManagementService,
    private designationService: DesignationManagementService,

    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {

      this.response = {
    id: 1
  } as EmployeeResponse;
    this.employeeLookUpData()
    this.getDepartments();
    this.initializeForm();
     this.initializeDepartmentForm();

     this.designationForm = this.fb.group({
  designationId: ['', Validators.required]
});


    this.steps = [
      {
        title: 'Employee Details',
        formGroup: this.createForm,
        completed: true,
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
  }
      // future steps can be added here easily
      // { title: 'Assign Roles', completed: false, action: this.saveRoles.bind(this) }
    ];
    this.createForm.patchValue(this.dummyData);
   
  }


  private initializeDepartmentForm() {
  this.departmentForm = this.fb.group({
    departmentId: ['', Validators.required]
  });
}
  onDepartmentSubmit() {
    this.designationService.getDesignationsByDepartment(1).subscribe({
      next: response => {
        this.designations = response.body;
        this.designationDD = this.designations.map(d => ({
          key: d.id.toString(),
          label: d.designationName // or whatever property contains the department name
        }));
      },
      error: error => console.error('Request Error:', error)
    });
  }

  get currentStep(): EmployeeStep {
    return this.steps[this.currentStepIndex];
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
      nationality: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      bloodGroup: [''],
      bio: [],
      joiningDate: [today, Validators.required],
    });
  }

  goToEmployeeList(): void {
    this.router.navigate(ROUTES.EMPLOYEE.LIST);
  }
  onEmployeeSubmit(): void {
    // Construct fullName before submitting
    this.createForm.get('fullName')?.setValue(
      `${this.createForm.get('firstName')?.value} ${this.createForm.get('middleName')?.value || ''} ${this.createForm.get('lastName')?.value}`.trim()
    );

    console.group('➡️ Submitting Employee Form');
    console.info('Form Data:', this.createForm.getRawValue());

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      console.warn('❌ Employee form is invalid', {
        invalidControls: this.getInvalidControls(),
        formValue: this.createForm.getRawValue()
      });
      return;
    }
    this.employeeManagementSerivce.save(this.createForm.getRawValue())
      .subscribe({
        next: (response) => {
          console.info('✅ Employee saved successfully', {
            status: response.status,
            employee: response.body

          });
          this.response = response.body;
          

          this.createForm.disable();
          this.currentStep.completed = true;
          this.nextStep();
          console.log(`Navigating to Employee Details: ID = ${this.response?.id}`);
          if (this.response?.id) {
            this.goToEmployeeDetail(this.response.id.toString());
          }
        },
        error: (error) => {
          console.error('❌ Failed to save employee', {
            status: error.status,
            message: error.message,
            formData: this.createForm.getRawValue()
          });
        },
        complete: () => {
          console.log('🔚 Employee form submission complete');
          console.groupEnd();
        }
      })
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    } else {
      console.log('✅ All steps completed');
    }
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
  employeeLookUpData() {
    console.group('📦 Fetching Employee Lookup Data');
    this.employeeManagementSerivce.getDocsMeta()
      .subscribe({
        next: (response) => {
          console.info('✅ Lookup data loaded', {
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
          console.error('❌ Failed to load lookup data', {
            status: error.status,
            message: error.message
          });
        },
        complete: () => {

          console.log('🔚 Request Complete');
          console.groupEnd();
        }
      })
  }

  // saveDepartment(departmentId?: number) {
  //   // this.employeeService.assignDepartment({ employeeId: this.employeeId, departmentId }).subscribe(() => {
  //   //   this.currentStep.completed = true;
  //   //   this.nextStep();
  //   // });
  //   this.currentStep.completed = true;
  //      this.nextStep();

  // }


saveDepartment() {
  if (!this.response?.id) {
    console.error('❌ Employee ID not found. Cannot assign department.');
    return;
  }

  if (this.departmentForm.invalid) {
    this.departmentForm.markAllAsTouched();
    console.warn('❌ Department form is invalid');
    return;
  }

  const payload = {
    employeeId: Number(this.response?.id),                        
    departmentId: Number(this.departmentForm.value.departmentId),
    createdBy: 1
  };

  console.group('➡️ Assign Department');
  console.info('Payload:', payload);

  this.departmentService.assignDepartment(payload).subscribe({
    next: (response) => {
      console.info('✅ Department assigned successfully', response.body);

      // Disable form and mark step completed
      this.departmentForm.disable();
      this.currentStep.completed = true;

      // Fetch designations for this department
      this.loadDesignationsByDepartment(payload.departmentId);

      // Go to next step
      this.nextStep();
    },
    error: (error) => {
      console.error('❌ Failed to assign department', {
        status: error.status,
        message: error.message,
        payload
      });
    },
    complete: () => {
      console.log('🔚 Department assignment completed');
      console.groupEnd();
    }
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
      console.info(`✅ Loaded ${this.designations.length} designations for department ID ${departmentId}`);
    },
    error: error => console.error('❌ Failed to load designations', error)
  });
}


  getDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: response => {
        this.departments = response.body;
        this.departmentDD = this.departments.map(d => ({
          key: d.id.toString(),
          label: d.departmentName // or whatever property contains the department name
        }));
      },
      error: error => console.error('Request Error:', error)
    });
  }

  saveDesignation(designationId?: number) {
  if (!this.response?.id) {
    console.error('❌ Employee ID not found. Cannot assign designation.');
    return;
  }

  // Use the selected designationId if provided, otherwise pick from first in dropdown
  const selectedDesignationId = designationId || Number(this.designationDD[0]?.key);
  if (!selectedDesignationId) {
    console.warn('❌ No designation selected');
    return;
  }

  // Build payload
  const payload = {
    employeeId: Number(this.response.id),
    designationId: selectedDesignationId,
    departmentId: Number(this.departmentForm.value.departmentId),
    createdBy: 1 // replace with logged-in user ID if available
  };

  console.group('➡️ Assign Designation');
  console.info('Payload:', payload);

  this.designationService.assignDesignation(payload).subscribe({
    next: (response) => {
      console.info('✅ Designation assigned successfully', response.body);

      // Mark step completed and disable any related form if you have one
      this.currentStep.completed = true;

      // Move to next step
      this.nextStep();
    },
    error: (error) => {
      console.error('❌ Failed to assign designation', {
        status: error.status,
        message: error.message,
        payload
      });
    },
    complete: () => {
      console.log('🔚 Designation assignment completed');
      console.groupEnd();
    }
  });
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
}
