import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';

import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { StudentManagementService } from '../../services/student-management.service';

import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { SectionResponse } from '../../../section-management/models/SectionResponse';
import { AcademicYear, AdmissionType } from '../../models/StudentResponse';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';

@Component({
  selector: 'app-student-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './student-create-form.component.html',
  styleUrls: ['./student-create-form.component.css']
})
export class StudentCreateFormComponent {

  private readonly MODULE = 'Student';
  private readonly COMPONENT = 'StudentForm';

  createForm!: FormGroup;
  routedId: string | null = null;
  isEditMode = false;

  campusDD: CampusResponse[] = [];
  standardDD: StandardResponse[] = [];
  sectionDD: SectionResponse[] = [];

  provinceDD: KeyValueOption[] = [];
  nationalityDD: KeyValueOption[] = [];
  religionDD: KeyValueOption[] = [];
  bloodGroupDD: KeyValueOption[] = [];
  genderDD: KeyValueOption[] = [];
  admissionTypesDD: AdmissionType[] = [];

  currentAcademicYear?: AcademicYear;

  constructor(
    private fb: FormBuilder,
    private campusService: CampusManagementService,
    private standardService: StandardManagementService,
    private sectionService: SectionManagementService,
    private studentService: StudentManagementService,
    private route: ActivatedRoute,
    private router: Router
    , private logger: LoggerService) { }

  ngOnInit(): void {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    this.initializeForm();
    this.loadLookups();
    this.getCampuses();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    LoggerUtil.log(this.MODULE, this.COMPONENT, 'Mode', this.isEditMode ? 'EDIT' : 'CREATE');

    this.onCampusChange();
    this.onStandardChange();
    LoggerUtil.groupEnd();
  }

  private initializeForm(): void {
    const today = new Date();

    this.createForm = this.fb.group({
      campusId: ['', Validators.required],
      standardId: ['', Validators.required],
      sectionId: ['', Validators.required],

      admissionTypeId: ['', Validators.required],
      academicYearId: ['', Validators.required],
      academicYearName: ['', Validators.required],

      firstName: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      middleName: ['', [Validators.maxLength(50), this.noWhitespaceValidator]],
      lastName: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],

      fullName: [''],

      studentCode: ['', [
        Validators.required,
        Validators.maxLength(20),
        this.noWhitespaceValidator
      ]],

      dateOfBirth: ['', [Validators.required, this.pastDateValidator]],
      gender: ['', Validators.required],

      cnic: ['', [
        Validators.required,
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
      enrollmentDate: [today, Validators.required],
    });

    LoggerUtil.log(this.MODULE, this.COMPONENT, 'Form initialized');
  }

  // ================= LOOKUPS =================

  private logInvalidFields(): void {
    const invalidControls = Object.keys(this.createForm.controls)
      .filter(key => this.createForm.get(key)?.invalid);

    if (invalidControls.length > 0) {
      console.log('Invalid fields:', invalidControls);
    } else {
      console.log('All fields are valid');
    }
  }
  private loadLookups(): void {
    this.studentService.getAdmissionType().subscribe(r => this.admissionTypesDD = r.body);
    this.studentService.getAddmissionMeta().subscribe(r => {
      this.provinceDD = Object.entries(r.body.provinces).map(([k, v]) => ({ key: k, label: v as string }));
      this.nationalityDD = Object.entries(r.body.nationalities).map(([k, v]) => ({ key: k, label: v as string }));
      this.religionDD = Object.entries(r.body.religions).map(([k, v]) => ({ key: k, label: v as string }));
      this.bloodGroupDD = Object.entries(r.body.bloodGroup).map(([k, v]) => ({ key: k, label: v as string }));
      this.genderDD = Object.entries(r.body.gender).map(([k, v]) => ({ key: k, label: v as string }));
    });

    this.studentService.getCurrentAcademicYear().subscribe(r => {
      this.currentAcademicYear = r.body;
      this.createForm.patchValue({
        academicYearId: r.body.id,
        academicYearName: r.body.name
      });
    });
  }

  private getCampuses(): void {
    this.campusService.getAllCampuses().subscribe(r => this.campusDD = r.body);
  }

  // ================= DROPDOWNS =================

  onCampusChange(): void {
    this.createForm.get('campusId')?.valueChanges.subscribe(id => {
      LoggerUtil.log(this.MODULE, 'CampusChange', id);
      this.createForm.patchValue({ standardId: '', sectionId: '' });
      this.sectionDD = [];
      this.standardService.getStandardsByCampusId(id).subscribe(r => this.standardDD = r.body);
    });
  }

  onStandardChange(): void {
    this.createForm.get('standardId')?.valueChanges.subscribe(id => {
      LoggerUtil.log(this.MODULE, 'StandardChange', id);
      this.sectionService.getSectionByStandardId(id).subscribe(r => this.sectionDD = r.body);
    });
  }

  // ================= SUBMIT =================

  onSubmit(): void {
    LoggerUtil.group(`🚀 [${this.MODULE}] Submit`);

    this.createForm.get('fullName')?.setValue(
      `${this.firstName?.value} ${this.middleName?.value || ''} ${this.lastName?.value}`.trim()
    );

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      LoggerUtil.error(this.MODULE, 'Submit', 'Form invalid', this.createForm.errors);
      this.logInvalidFields()
      LoggerUtil.groupEnd();
      return;
    }

    this.studentService.save(this.routedId, this.createForm.getRawValue())
      .subscribe({
        next: r => {
          LoggerUtil.log(this.MODULE, 'Submit', 'Saved', r.body);
          this.goToFeeCalculator(r.body);
          //this.router.navigate(ROUTES.STUDENT.STUDENT_FEE_CALCULATOR.DETAILS);
        },
        error: e => LoggerUtil.error(this.MODULE, 'Submit', 'Save failed', e),
        complete: () => LoggerUtil.groupEnd()
      });
  }

  goToFeeCalculator(resourceData: any) {
    this.router.navigate(ROUTES.STUDENT.STUDENT_FEE_CALCULATOR.DETAILS, {
      queryParams: {
        studentId: resourceData.id,
        academicYearId: resourceData.academicYearId,
        campusId: resourceData.campusId,
        standardId: resourceData.standardId,
        mode: 'create'
      }
    })
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
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to Student list');
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

  get campusId() { return this.createForm.get('campusId'); }
  get standardId() { return this.createForm.get('standardId'); }
  get sectionId() { return this.createForm.get('sectionId'); }

  get admissionTypeId() { return this.createForm.get('admissionTypeId'); }
  get academicYearId() { return this.createForm.get('academicYearId'); }
  get academicYearName() { return this.createForm.get('academicYearName'); }

  get firstName() { return this.createForm.get('firstName'); }
  get middleName() { return this.createForm.get('middleName'); }
  get lastName() { return this.createForm.get('lastName'); }
  get fullName() { return this.createForm.get('fullName'); }

  get studentCode() { return this.createForm.get('studentCode'); }

  get dateOfBirth() { return this.createForm.get('dateOfBirth'); }
  get gender() { return this.createForm.get('gender'); }

  get cnic() { return this.createForm.get('cnic'); }
  get passportNumber() { return this.createForm.get('passportNumber'); }

  get phone() { return this.createForm.get('phone'); }
  get email() { return this.createForm.get('email'); }

  get religion() { return this.createForm.get('religion'); }
  get nationality() { return this.createForm.get('nationality'); }
  get bloodGroup() { return this.createForm.get('bloodGroup'); }

  get enrollmentDate() { return this.createForm.get('enrollmentDate'); }

}
