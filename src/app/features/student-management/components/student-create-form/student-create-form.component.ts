import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-student-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, ToasterComponent],
  templateUrl: './student-create-form.component.html',
  styleUrls: ['./student-create-form.component.css']
})
export class StudentCreateFormComponent implements OnInit {

  @ViewChild('toaster') toaster?: ToasterComponent;

  private readonly MODULE = 'Student';
  private readonly COMPONENT = 'StudentForm';

  createForm!: FormGroup;
  guardianForm!: FormGroup;
  
  routedId: string | null = null;
  isEditMode = false;
  
  showGuardianForm = false;
  savedStudentId: number | null = null;
  isLoading = false;
  loadingMessage = '';

  campusDD: CampusResponse[] = [];
  standardDD: StandardResponse[] = [];
  sectionDD: SectionResponse[] = [];

  genderDD: KeyValueOption[] = [];
  admissionTypesDD: AdmissionType[] = [];
  guardianRelationDD: any[] = [];

  currentAcademicYear?: AcademicYear;

  constructor(
    private fb: FormBuilder,
    private campusService: CampusManagementService,
    private standardService: StandardManagementService,
    private sectionService: SectionManagementService,
    private studentService: StudentManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadLookups();
    this.getCampuses();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    this.onCampusChange();
    this.onStandardChange();
  }

  private initializeForms(): void {
    const today = new Date();

    this.createForm = this.fb.group({
      campusId: ['', Validators.required],
      standardId: ['', Validators.required],
      sectionId: ['', Validators.required],

      admissionTypeId: ['', Validators.required],
      academicYearId: ['', Validators.required],
      academicYearName: ['', Validators.required],

      firstName: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      middleName: ['', [Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      fullName: [''], 

      dateOfBirth: ['', [Validators.required, this.pastDateValidator]],
      gender: ['', Validators.required],

      cnic: ['', [Validators.maxLength(20)]],
      passportNumber: ['', [Validators.maxLength(20)]],

      phone: ['', [Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(200)]],
      
      enrollmentDate: [today, Validators.required],
      isActive: [true],
      status: ['Pending']
    });

    this.guardianForm = this.fb.group({
      firstName: ['', [Validators.required, this.noWhitespaceValidator]],
      middleName: [''],
      lastName: ['', [Validators.required, this.noWhitespaceValidator]],
      fullName: [''],
      relationId: ['', Validators.required],
      cnic: ['', Validators.required],
      phone: ['', Validators.required],
      alternatePhone: [''],
      email: ['', Validators.email],
      address: ['']
    });
  }

  private loadLookups(): void {
    this.studentService.getAdmissionType().subscribe(r => this.admissionTypesDD = r.body);
    
    this.studentService.getAddmissionMeta().subscribe(r => {
      if(r.body.gender) {
        this.genderDD = Object.entries(r.body.gender).map(([k, v]) => ({ key: k, label: v as string }));
      }
    });

    this.studentService.getActiveGuardianRelations().subscribe({
      next: (r) => {
        this.guardianRelationDD = r?.body?.data || r?.body || r?.data || [];
        if (!Array.isArray(this.guardianRelationDD)) {
           this.guardianRelationDD = Object.values(this.guardianRelationDD);
        }
      },
      error: (e) => console.error('Failed to load guardian relations:', e)
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

  onCampusChange(): void {
    this.createForm.get('campusId')?.valueChanges.subscribe(id => {
      if(!id) return;
      this.createForm.patchValue({ standardId: '', sectionId: '' });
      this.sectionDD = [];
      this.standardService.getStandardsByCampusId(id).subscribe(r => this.standardDD = r.body);
    });
  }

  onStandardChange(): void {
    this.createForm.get('standardId')?.valueChanges.subscribe(id => {
      if(!id) return;
      this.sectionService.getSectionByStandardId(id).subscribe(r => this.sectionDD = r.body);
    });
  }

  onSubmitStudent(): void {
    this.createForm.get('fullName')?.setValue(
      `${this.firstName?.value} ${this.middleName?.value || ''} ${this.lastName?.value}`.trim().replace(/\s+/g, ' ')
    );

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Saving Student...';

    this.studentService.save(this.routedId, this.createForm.getRawValue())
      .subscribe({
        next: r => {
          this.savedStudentId = r.body.id;
          this.showGuardianForm = true;
          this.createForm.disable();
          this.toaster?.show('Student saved successfully! Please add a guardian.', 'success');
          this.cdr.detectChanges();
        },
        error: e => {
          console.error('Failed to save student', e);
          this.toaster?.show('Failed to save Student. Please try again.', 'error');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  onSubmitGuardian(): void {
    if(!this.savedStudentId) return;

    this.guardianForm.get('fullName')?.setValue(
      `${this.guardianForm.value.firstName} ${this.guardianForm.value.middleName || ''} ${this.guardianForm.value.lastName}`.trim().replace(/\s+/g, ' ')
    );

    if (this.guardianForm.invalid) {
      this.guardianForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Saving Guardian...';

    const payload = {
      ...this.guardianForm.getRawValue(),
      studentId: this.savedStudentId
    };

    this.studentService.saveGuardian(payload).subscribe({
      next: () => {
        this.toaster?.show('Guardian saved successfully!', 'success');
        setTimeout(() => this.goToListing(), 1500);
      },
      error: e => {
        console.error('Failed to save guardian', e);
        this.toaster?.show('Failed to save Guardian. Please try again.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

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

  getErrorMessage(controlName: string, isGuardian = false): string {
    const control = isGuardian ? this.guardianForm.get(controlName) : this.createForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['maxlength']) return 'Exceeds maximum length.';
    if (control.errors['whitespace']) return 'Cannot be empty.';
    if (control.errors['email']) return 'Invalid email address.';
    if (control.errors['futureDate']) return 'Date cannot be in the future.';
    
    return 'Invalid field.';
  }

  goToListing() {
    this.router.navigate(ROUTES.STUDENT.LIST);
  }

  // Common Getters for Student
  get campusId() { return this.createForm.get('campusId'); }
  get standardId() { return this.createForm.get('standardId'); }
  get sectionId() { return this.createForm.get('sectionId'); }
  get admissionTypeId() { return this.createForm.get('admissionTypeId'); }
  get academicYearId() { return this.createForm.get('academicYearId'); }
  get academicYearName() { return this.createForm.get('academicYearName'); }
  
  get firstName() { return this.createForm.get('firstName'); }
  get middleName() { return this.createForm.get('middleName'); }
  get lastName() { return this.createForm.get('lastName'); }
  
  get dateOfBirth() { return this.createForm.get('dateOfBirth'); }
  get gender() { return this.createForm.get('gender'); }
  get email() { return this.createForm.get('email'); }
  get phone() { return this.createForm.get('phone'); }
  get cnic() { return this.createForm.get('cnic'); }
  get passportNumber() { return this.createForm.get('passportNumber'); }
  get address() { return this.createForm.get('address'); }

  // Getters for Guardian
  get gFirstName() { return this.guardianForm.get('firstName'); }
  get gLastName() { return this.guardianForm.get('lastName'); }
  get gRelationId() { return this.guardianForm.get('relationId'); }
  get gCnic() { return this.guardianForm.get('cnic'); }
  get gPhone() { return this.guardianForm.get('phone'); }
  get gEmail() { return this.guardianForm.get('email'); }
}
