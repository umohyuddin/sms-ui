import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { StudentManagementService } from '../../services/student-management.service';
import { AcademicYear, StudentResponse } from '../../models/StudentResponse';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';

import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-student-profile-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
  templateUrl: './student-profile-detail.component.html',
  styleUrl: './student-profile-detail.component.css'
})
export class StudentProfileDetailComponent {

  @Output() studentDataChange = new EventEmitter<StudentResponse>();
  provinceDD: KeyValueOption[] = [];
  nationalityDD: KeyValueOption[] = [];
  religionDD: KeyValueOption[] = [];
  bloodGroupDD: KeyValueOption[] = [];
  genderDD: KeyValueOption[] = [];

  createForm!: FormGroup;
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  showStudentForm: boolean = false;
  studentData?: StudentResponse;
  @Input() studentId!: string;

  isLoading = false;
  loadingMessage = '';

  constructor(
    private fb: FormBuilder,
    private studentManagementService: StudentManagementService,
    private router: Router
    , private logger: LoggerService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadLookups();
    this.getStudentDetails(this.studentId);

  }


  private loadLookups(): void {
    this.studentManagementService.getAddmissionMeta().subscribe(r => {
      this.provinceDD = Object.entries(r.body.provinces).map(([k, v]) => ({ key: k, label: v as string }));
      this.religionDD = Object.entries(r.body.religions).map(([k, v]) => ({ key: k, label: v as string }));
      this.bloodGroupDD = Object.entries(r.body.bloodGroup).map(([k, v]) => ({ key: k, label: v as string }));
      this.genderDD = Object.entries(r.body.gender).map(([k, v]) => ({ key: k, label: v as string }));
    });

    this.studentManagementService.getCountries().subscribe({
  next: (response) => {
    const countries = response.body || [];
    this.nationalityDD = countries.map((c: any) => ({
      key: c.countryName,
      label: c.countryName
    }));
  },
  error: (err) => console.error('❌ Error fetching countries for nationality dropdown:', err)
});
  }
  private initializeForm(): void {
    const today = new Date();

    this.createForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      middleName: ['', [Validators.maxLength(50), this.noWhitespaceValidator]],
      lastName: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],

      fullName: [''],


      dateOfBirth: ['', [Validators.required, this.pastDateValidator]],
      gender: ['', Validators.required],

      cnic: ['', [
        Validators.pattern(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/)
      ]],

      passportNumber: [''],

      phone: ['', [
        Validators.required,
        Validators.pattern(/^\+?[0-9]{10,15}$/)
      ]],

      email: ['', [Validators.required, Validators.email]],
      religion: ['', Validators.required],
      nationality: ['', Validators.required],
      bloodGroup: [''],
      address: ['', [Validators.maxLength(250)]]
    });

  }

  patchStudentForm(): void {
    if (!this.studentData || !this.createForm) return;

    this.createForm.patchValue({
      firstName: this.studentData.firstName,
      middleName: this.studentData.middleName,
      lastName: this.studentData.lastName,
      fullName: this.studentData.fullName,
      dateOfBirth: this.studentData.dateOfBirth,
      gender: this.studentData.gender,

      cnic: this.studentData.cnic,
      passportNumber: this.studentData.passportNumber,

      phone: this.studentData.phone,
      email: this.studentData.email,

      religion: this.studentData.religion?.toUpperCase() || '',
      nationality: this.studentData.nationality?.toUpperCase() || '',
      bloodGroup: this.studentData.bloodGroup || '',
      address: this.studentData.address || ''
      //bloodGroup: this.BLOOD_GROUP_API_TO_UI[this.studentData.bloodGroup] ?? '',
    });
  }


  onStudentSubmit() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Updating Student Details...';
    this.createForm.disable();

    this.studentManagementService.updateStudent(this.studentId, this.createForm.value)
      .subscribe({
        next: () => {
          this.getStudentDetails(this.studentId);
          this.createForm.disable();
          this.toaster?.show('Student information updated successfully.', 'success');
        },
        error: (error) => {
          console.error('❌ Error updating student:', error);
          this.toaster?.show('Failed to update student information.', 'error');
        },
        complete: () => {
          this.isLoading = false;
          this.loadingMessage = '';
          this.createForm.enable();
        }
      });
  }



  getStudentDetails(studentId: string): void {
    console.log(`📤 Fetching student details for ID: ${studentId}`);
    this.studentManagementService.getStudentById(studentId).subscribe({
      next: (response) => {
        this.studentData = response.body;
        this.patchStudentForm();
        console.log('✅ Student details fetched:', this.studentData);
        this.studentDataChange.emit(this.studentData);
      },
      error: (error) => console.error('❌ Error fetching student details:', error),
      complete: () => console.log('✅ getStudentDetails completed')
    });
  }


  toggleStudentForm(studentId: string | null = null): void {
    this.showStudentForm = !this.showStudentForm;

    if (this.showStudentForm) {
      // Ensure the form is editable when opening
      this.createForm.enable();
    }

    if (studentId) {
      // EDIT MODE
      this.patchStudentForm();
    } else {
      // ADD / RESET MODE
      this.createForm.reset();
    }
  }


  // ================= VALIDATORS =================

  noWhitespaceValidator(control: AbstractControl) {
    if (control.value && !control.value.toString().trim()) {
      return { whitespace: true };
    }
    return null;
  }

  pastDateValidator(control: AbstractControl) {
    if (!control.value) return null;
    return new Date(control.value) > new Date() ? { futureDate: true } : null;
  }

  // ================= ERROR MESSAGES =================

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }

  goToListing() {
    this.router.navigate(ROUTES.STUDENT.LIST);
  }

  validationMessages = {
    campusId: {
      required: 'Campus is required.'
    },
    standardId: {
      required: 'Standard is required.'
    },
    sectionId: {
      required: 'Section is required.'
    },
    admissionTypeId: {
      required: 'Admission Type is required.'
    },
    firstName: {
      required: 'First Name is required.',
      maxlength: 'First Name cannot exceed 50 characters.',
      whitespace: 'First Name cannot be empty.'
    },
    lastName: {
      required: 'Last Name is required.',
      maxlength: 'Last Name cannot exceed 50 characters.',
      whitespace: 'Last Name cannot be empty.'
    },
    studentCode: {
      required: 'Student Code is required.',
      maxlength: 'Student Code cannot exceed 20 characters.',
      pattern: 'Student Code can contain letters and numbers only.'
    },
    cnic: {
      required: 'National ID is required.',
      pattern: 'Invalid CNIC / B-Form / Passport format.'
    },
    dateOfBirth: {
      required: 'Date of Birth is required.'
    },
    phone: {
      required: 'Phone number is required.',
      pattern: 'Phone number must be valid.'
    },
    email: {
      required: 'Email is required.',
      email: 'Email must be valid.'
    },
    gender: {
      required: 'Gender is required.'
    },
    religion: {
      required: 'Religion is required.'
    },
    nationality: { required: 'Nationality is required.' }
  };

  // ================= GETTERS =================

  get firstName() { return this.createForm.get('firstName'); }
  get middleName() { return this.createForm.get('middleName'); }
  get lastName() { return this.createForm.get('lastName'); }
  get fullName() { return this.createForm.get('fullName'); }

  get dateOfBirth() { return this.createForm.get('dateOfBirth'); }
  get gender() { return this.createForm.get('gender'); }

  get cnic() { return this.createForm.get('cnic'); }
  get passportNumber() { return this.createForm.get('passportNumber'); }

  get phone() { return this.createForm.get('phone'); }
  get email() { return this.createForm.get('email'); }

  get religion() { return this.createForm.get('religion'); }
  get nationality() { return this.createForm.get('nationality'); }
  get bloodGroup() { return this.createForm.get('bloodGroup'); }
  get address() { return this.createForm.get('address'); }

  BLOOD_GROUP_API_TO_UI: Record<string, string> = {
    'A+': 'A_POSITIVE',
    'A-': 'A_NEGATIVE',
    'B+': 'B_POSITIVE',
    'B-': 'B_NEGATIVE',
    'AB+': 'AB_POSITIVE',
    'AB-': 'AB_NEGATIVE',
    'O+': 'O_POSITIVE',
    'O-': 'O_NEGATIVE'
  };

}
