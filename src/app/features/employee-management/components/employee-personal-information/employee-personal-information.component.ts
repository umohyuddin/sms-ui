import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { EmployeeDocumentResponseDto } from '../../models/EmployeeDocumentResponseDto';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { StudentFeeSummaryResponse } from '../../models/StudentFeeSummaryResponse';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { CommonModule } from '@angular/common';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { SmsUtil } from '../../../../core/utils/smsUtil';

@Component({
  selector: 'app-employee-personal-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-personal-information.component.html',
  styleUrl: './employee-personal-information.component.css'
})
export class EmployeePersonalInformationComponent {
  updateForm!: FormGroup;
  selectedAvatar!: File;
  employeeData?: EmployeeResponse;
  routedId!: string;
  activeTab: string = 'overview';
  avatarPreview: string = './assets/media/users/default.jpg';
  personalForm!: FormGroup;
  showPersonalForm: boolean = false;
  docsTypeDD: KeyValueOption[] = [];
  nationalityDD: KeyValueOption[] = [];
  religionDD: KeyValueOption[] = [];
  bloodGroupDD: KeyValueOption[] = [];
  genderDD: KeyValueOption[] = [];
  maritalStatusDD: KeyValueOption[] = [];
  religionsDD: KeyValueOption[] = [];
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

    this.getEmployeeDetails(this.routedId);


    this.personalForm = this.fb.group({
      fullName: [''],
      email: [''],
      primaryPhone: [''],
      gender: [''],
      dob: ['']
    });
  }

  togglePersonalForm() {
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


  getEmployeeDetails(id: string): void {
    console.group(`Fetching Employee Details - ID: ${id}`);
    this.employeeManagementService.getEmployeeById(id).subscribe({
      next: (response) => {
        console.log('%c✅ Request Successful', 'color: green; font-weight: bold;');
        console.log('Employee Response:', { status: response.status, data: response.body });
        this.employeeData = response.body;

        if (this.employeeData?.profilePicture) {
          this.avatarPreview = `${this.appConfig.apiBaseUrl}/${this.employeeData.profilePicture.replace(/\\/g, '/')}`;
          console.log('Avatar Preview URL:', this.avatarPreview);
        } else {
          console.warn('⚠️ No profile picture found, using default avatar.');
        }

        this.updateForm.patchValue(this.employeeData??{});

        // Optional: compute fullName if needed
        this.updateForm.get('fullName')?.setValue(
          `${this.employeeData?.firstName || ''} ${this.employeeData?.lastName || ''} ${this.employeeData?.lastName || ''}`.trim()
        );
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

  uploadAvatar() {
    if (!this.selectedAvatar) {
      console.error('No avatar selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedAvatar);
    formData.append('employeeId', String(this.routedId));

    this.employeeManagementService.uploadProfilePhoto(formData).subscribe({
      next: (response) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);

        // This is upload response, NOT full employee
        if (this.employeeData) {
          this.employeeData.profilePicture = response.body.filePath;
        }
      },
      error: (error) => {
        console.error('❌ Error:', error);
      }
    });
  }
  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedAvatar = file;

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
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
    this.employeeManagementService.update(this.updateForm.getRawValue(),this.routedId)
      .subscribe({
        next: (response) => {
          console.info('✅ Employee saved successfully', {
            status: response.status,
            employee: response.body
          });
          this.response = response.body;
          console.log(`Employee Details: ID = ${this.response?.id}`);
          this.employeeData = response.body
          this.togglePersonalForm();

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
