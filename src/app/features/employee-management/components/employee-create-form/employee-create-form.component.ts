import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionResponse } from '../../../section-management/models/SectionResponse';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { StudentManagementService } from '../../services/student-management.service';
import { KeyValueOption } from '../../../fee-catalog-management/models/feeConfig';
import { AcademicYear, AdmissionType } from '../../models/StudentResponse';



@Component({
  selector: 'app-student-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './student-create-form.component.html',
  styleUrls: ['./student-create-form.component.css']
})
export class StudentCreateFormComponent {
  createForm!: FormGroup;
  routeSectionId?: string;
  mode = '';
  standardData: StandardResponse[] = [];
  sectionData?: SectionResponse;
  campuses: CampusResponse[] = [];
  cities: any[] = [];
  routedId: string | null = null;
  isEditMode: boolean = false;
  sectionDD: SectionResponse[] = [];
  provinceDD: KeyValueOption[] = [];
  currentAcademicYear?: AcademicYear;

  nationalityDD: KeyValueOption[] = [];
  religionDD: KeyValueOption[] = [];
  bloodGroupDD: KeyValueOption[] = [];
  genderDD: KeyValueOption[] = [];
  admissionTypesDD: AdmissionType[] = [];

  constructor(
    private campusManagementService: CampusManagementService,
    private standardManagemenetService: StandardManagementService,
    private sectionManagementService: SectionManagementService,
    private studentManagementSerivce: StudentManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getGetAddmissionTypes();
    this.getCurrentAcademicYear()
    this.AddmissionLookUpData();
    this.getCampuses();
    this.initializeForm();
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routedId);
      this.getSectionDetails(this.routedId!);
    } else {
      console.log('Create Mode Activated');
    }
    this.onCampusChange();
    this.onStandardChange();

    this.createForm.patchValue(this.dummyAdmissionData);

  }
  getGetAddmissionTypes() {
    this.studentManagementSerivce.getAdmissionType().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.admissionTypesDD = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }
  getCurrentAcademicYear() {
    this.studentManagementSerivce.getCurrentAcademicYear().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.currentAcademicYear = response.body;
        this.createForm.get('academicYearId')?.setValue(this.currentAcademicYear?.id)
        this.createForm.get('academicYearName')?.setValue(this.currentAcademicYear?.name)
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }
  AddmissionLookUpData() {
    this.studentManagementSerivce.getAddmissionMeta()
      .subscribe({
        next: (response) => {
          console.log('  Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.provinceDD = Object.entries(response.body.provinces).map(
            ([key, label]) => ({ key, label: label as string })
          );

          this.nationalityDD = Object.entries(response.body.nationalities).map(
            ([key, label]) => ({ key, label: label as string })
          );

          this.religionDD = Object.entries(response.body.religions).map(
            ([key, label]) => ({ key, label: label as string })
          );

          this.bloodGroupDD = Object.entries(response.body.bloodGroup).map(
            ([key, label]) => ({ key, label: label as string })
          );
          this.genderDD = Object.entries(response.body.gender).map(
            ([key, label]) => ({ key, label: label as string })
          );
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

  onCampusChange() {
    this.createForm.get('campusId')?.valueChanges.subscribe(campusId => {
      console.log("Campus changed:", campusId);

      const standardCtrl = this.createForm.get('standardId');
      standardCtrl?.setValue('');
      standardCtrl?.markAsUntouched();
      standardCtrl?.markAsPristine();

      // Reset Section dropdown
      const sectionCtrl = this.createForm.get('sectionId');
      sectionCtrl?.setValue('');
      sectionCtrl?.markAsUntouched();
      sectionCtrl?.markAsPristine();

      // Clear Section options
      this.sectionDD = [];
      this.loadStandardByCampusId(campusId);
    });
  }

  onStandardChange() {
    this.createForm.get('standardId')?.valueChanges.subscribe(standardId => {
      console.log("Standard changed:", standardId);
      this.loadSectionByStandardId(standardId);
    });
  }
  loadStandardByCampusId(campusId: any) {
    this.standardManagemenetService.getCampusById(campusId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.standardData = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        //this.router.navigate(['/Campuses']);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }
  loadSectionByStandardId(standardId: any) {
    this.sectionManagementService.getSectionByStandardId(standardId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.sectionDD = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }
  getSectionDetails(sectionId: string): void {
    this.sectionManagementService.getSectionById(sectionId)
      .subscribe({
        next: (response) => {
          console.log('  Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.sectionData = response.body;
          console.log('📦 Standard data :', this.sectionData);
          this.createForm.patchValue({
            sectionName: this.sectionData?.sectionName,
            sectionCode: this.sectionData?.sectionCode,
            description: this.sectionData?.description,
            campusId: this.sectionData?.standard.campus.id,
            standardId: this.sectionData?.standard.id
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

  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.campuses = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }

  private initializeForm() {
    const today = new Date();
    this.createForm = this.fb.group({
      campusId: ['', Validators.required],
      standardId: ['', Validators.required],
      sectionId: ['', Validators.required],
      admissionTypeId: ['', Validators.required],
      academicYearId: ['', Validators.required],
      academicYearName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      fullName: [''],
      studentCode: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      cnic: ['', Validators.required],
      passportNumber: [''],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      religion: ['', Validators.required],
      nationality: ['', Validators.required],
      bloodGroup: [''],
      enrollmentDate: [today, Validators.required],
    });
  }

  goToSectionsList(): void {
    this.router.navigate(ROUTES.CAMPUS.SECTION.LIST);
  }
  onSubmit(): void {
    // Construct fullName before submitting
    this.createForm.get('fullName')?.setValue(
      `${this.createForm.get('firstName')?.value} ${this.createForm.get('middleName')?.value || ''} ${this.createForm.get('lastName')?.value}`.trim()
    );

    console.log('  Create standard Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }
    this.goToFeeCalculator()
    // this.studentManagementSerivce.save(this.routedId, this.createForm.getRawValue()).subscribe({
    //   next: (response) => {
    //     console.log('  Success Status:', response.status);
    //     console.log('📦 Response Body:', response.body);
    //     this.router.navigate(ROUTES.CAMPUS.SECTION.LIST);
    //   },
    //   error: (error) => {
    //     console.error('❌ Post Error Status:', error.status);
    //     console.error('Message:', error.message);
    //   },
    //   complete: () => {
    //     console.log('🔚 Post Complete');
    //   }
    // })
  }
  goToFeeCalculator() {
    this.router.navigate(ROUTES.STUDENT.STUDENT_FEE_CALCULATOR.DETAILS, {
      queryParams: {
        studentId: 1,
        academicYearId: 3,
        campusId: 1,
        standardId: 1
      }
    })
  }

  //getters

  get campusId() { return this.createForm.get('campusId'); }
  get standardId() { return this.createForm.get('standardId'); }
  get sectionId() { return this.createForm.get('sectionId'); }
  get firstName() { return this.createForm.get('firstName'); }
  get lastName() { return this.createForm.get('lastName'); }
  get middleName() { return this.createForm.get('middleName'); }
  get studentCode() { return this.createForm.get('studentCode'); }
  get dateOfBirth() { return this.createForm.get('dateOfBirth'); }
  get gender() { return this.createForm.get('gender'); }
  get crc() { return this.createForm.get('crc'); }
  get cnic() { return this.createForm.get('cnic'); }
  get passportNumber() { return this.createForm.get('passportNumber'); }
  get phone() { return this.createForm.get('phone'); }
  get religion() { return this.createForm.get('religion'); }
  get nationality() { return this.createForm.get('nationality'); }
  get bloodGroup() { return this.createForm.get('bloodGroup'); }
  get enrollmentDate() { return this.createForm.get('enrollmentDate'); }
  get email() { return this.createForm.get('email'); }
  get admissionTypeId() { return this.createForm.get('admissionTypeId'); }



  dummyAdmissionData = {
    campusId: 1,
    standardId: 5,
    sectionId: 2,
    admissionTypeId: 1,

    firstName: 'Ayaan',
    middleName: 'Khan',
    lastName: 'Ahmed',
    studentCode: 'STU-2025-001',

    academicYearId: 3,
    academicYearName: '2024-2025',

    dateOfBirth: '2015-03-12',
    gender: 'MALE',

    cnic: '37405-1234567-1',
    passportNumber: 'PAK1234567',

    phone: '03001234567',
    email: 'ayaan.ahmed@example.com',

    religion: 'ISLAM',
    nationality: 'PAKISTANI',
    bloodGroup: 'O_POSITIVE',

    enrollmentDate: '2025-01-10'
  };

}
