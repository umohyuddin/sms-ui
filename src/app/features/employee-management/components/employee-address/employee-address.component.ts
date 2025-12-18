import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { EmployeeAddress } from '../../models/EmployeeAddress';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-address.component.html',
  styleUrl: './employee-address.component.css'
})
export class EmployeeAddressComponent {
    updateForm!: FormGroup;
  employeeAddressData: EmployeeAddress[] = [];
  selectedAddress?: EmployeeAddress;
  routedId!: string;
  activeTab: string = 'overview';
  personalForm!: FormGroup;
  showPersonalForm: boolean = false;
  response?: EmployeeResponse;
  constructor(
    private fb: FormBuilder,
    private employeeManagementService: EmployeeManagementService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }



  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('employee ID from route:', this.routedId);
    this.employeeLookUpData();
    this.initializeForm();

    this.getEmployeeAddressDetails(this.routedId);


    this.personalForm = this.fb.group({
      fullName: [''],
      email: [''],
      primaryPhone: [''],
      gender: [''],
      dob: ['']
    });
  }

  togglePersonalForm(id: any) {
    console.log("received Id", id);
    this.getEmployeeAddressById(id);
    this.showPersonalForm = !this.showPersonalForm;
  }

  updatePersonalInfo() {
    if (this.personalForm.valid) {
      console.log(this.personalForm.value);
      // Call API to save data
      this.showPersonalForm = false; // hide form after update
    }
  }


  private initializeForm() {
    const today = new Date();
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      fullName: [''],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      passportNumber: [''],
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


  getEmployeeAddressDetails(id: string): void {
    console.group(`Fetching Employee Details - ID: ${id}`);
    this.employeeManagementService.getEmployeeAddress(id).subscribe({
      next: (response) => {
        console.log('%c✅ Request Successful', 'color: green; font-weight: bold;');
        console.log('Employee Response:', { status: response.status, data: response.body });
        this.employeeAddressData = response.body;



        this.updateForm.patchValue(this.employeeAddressData ?? {});
      },
      error: (error) => {
        console.error('%c❌ Request Failed', 'color: red; font-weight: bold;');
        console.error('Employee Request Error:', { status: error.status, message: error.message });
      },
      complete: () => {
        console.log('%c🔚 Request Complete', 'color: blue; font-weight: bold;');
        console.groupEnd();
      }
    });
  }



  employeeLookUpData() {
    console.group('📦 Fetching Employee Lookup Data');
    this.employeeManagementService.getDocsMeta()
      .subscribe({
        next: (response) => {
          console.info('✅ Lookup data loaded', {
            status: response.status,
            body: response.body
          });
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

  getEmployeeAddressById(id: any) {
    console.group('📦 Fetching Employee Lookup Data');
    this.employeeManagementService.getEmployeeAddressById(id)
      .subscribe({
        next: (response) => {
          console.info('✅ Lookup data loaded', {
            status: response.status,
            body: response.body
          });
          this.selectedAddress = response.body;
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


  private getInvalidControls(): string[] {
    const invalid: string[] = [];
    const controls = this.updateForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  onSubmit(): void {
    // Construct fullName before submitting
    this.updateForm.get('fullName')?.setValue(
      `${this.updateForm.get('firstName')?.value} ${this.updateForm.get('middleName')?.value || ''} ${this.updateForm.get('lastName')?.value}`.trim()
    );

    console.group('➡️ Submitting Employee Form');
    console.info('Form Data:', this.updateForm.getRawValue());

    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      console.warn('❌ Employee form is invalid', {
        invalidControls: this.getInvalidControls(),
        formValue: this.updateForm.getRawValue()
      });
      return;
    }
    this.employeeManagementService.update(this.updateForm.getRawValue(), this.routedId)
      .subscribe({
        next: (response) => {
          console.info('✅ Employee saved successfully', {
            status: response.status,
            employee: response.body
          });
          this.response = response.body;
          console.log(`Employee Details: ID = ${this.response?.id}`);

          this.employeeAddressData = response.body
          //this.togglePersonalForm();

        },
        error: (error) => {
          console.error('❌ Failed to save employee', {
            status: error.status,
            message: error.message,
            formData: this.updateForm.getRawValue()
          });
        },
        complete: () => {
          console.log('🔚 Employee form submission complete');
          console.groupEnd();
        }
      })
  }
  //getters
  get firstName() { return this.updateForm.get('firstName'); }
  get lastName() { return this.updateForm.get('lastName'); }
  get middleName() { return this.updateForm.get('middleName'); }
  get fullName() { return this.updateForm.get('fullName'); }
  get dateOfBirth() { return this.updateForm.get('dateOfBirth'); }
  get gender() { return this.updateForm.get('gender'); }
  get cnic() { return this.updateForm.get('cnic'); }
  get passportNumber() { return this.updateForm.get('passportNumber'); }
  get primaryPhone() { return this.updateForm.get('primaryPhone'); }
  get secondaryPhone() { return this.updateForm.get('secondaryPhone'); }
  get workPhone() { return this.updateForm.get('workPhone'); }
  get email() { return this.updateForm.get('email'); }
  get religion() { return this.updateForm.get('religion'); }
  get nationality() { return this.updateForm.get('nationality'); }
  get bloodGroup() { return this.updateForm.get('bloodGroup'); }
  get bio() { return this.updateForm.get('bio'); }
  get joiningDate() { return this.updateForm.get('joiningDate'); }
  get maritalStatus() { return this.updateForm.get("maritalStatus"); }
}
