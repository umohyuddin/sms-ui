import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CampusManagementService } from '../../services/campus-management.service';
import { SchoolProfileManagementService } from '../../../school-profile-management/services/school-profile-management.service';
import { InstituteResponse } from '../../../school-profile-management/models/InstituteResponse';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { LoggerService } from '../../../../core/services/logger.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';

@Component({
  selector: 'app-campus-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, ToasterComponent],
  templateUrl: './campus-create-form.component.html',
  styleUrls: ['./campus-create-form.component.css']
})
export class CampusCreateFormComponent {
  pageConst = PageTexts;
  meta?: any;
  createCampusForm!: FormGroup;
  isEditMode = false;
  campusId: string | null = null;
  campusData: any;
  provinceDD: KeyValueOption[] = [];
  citiesDD: KeyValueOption[] = [];
  isLoading = false;
  loadingMessage = '';

  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  private readonly MODULE = 'Campus';
  private readonly COMPONENT = 'CampusForm';

  constructor(
    private fb: FormBuilder,
    private appConfig: AppConfigService,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
    private campusManagementService: CampusManagementService,
    private schoolProfileService: SchoolProfileManagementService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing component');

    this.initializeForm();

    this.campusId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.campusId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    if (this.isEditMode) {
      this.loadCampusDetails(this.campusId!);
    }

    this.setupFormListeners();
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Component initialization complete');
    LoggerUtil.groupEnd(); // Close Init group
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createCampusForm = this.fb.group({
      instituteId: ['', Validators.required],
      instituteName: ['', Validators.required],
      countryId: ['', Validators.required],
      provinceId: ['', Validators.required],
      cityId: ['', Validators.required],
      campusName: ['', [Validators.required, this.noWhitespaceValidator]],
      campusCode: ['', [Validators.maxLength(20), this.noWhitespaceValidator]],
      active: [true],
      contactNumber: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      address: ['', [Validators.maxLength(500), this.noWhitespaceValidator]]
    });
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');
    LoggerUtil.groupEnd(); // Close Form Initialization group
  }

  private setupFormListeners() {
    LoggerUtil.group(`🔄 [${this.MODULE}] Form Listeners`);

    this.createCampusForm.get('countryId')?.valueChanges.subscribe(countryId => {
      if (!countryId) {
        this.provinceDD = [];
        this.citiesDD = [];
        return;
      }
      LoggerUtil.log(this.MODULE, 'Country', '🔄 Country changed', countryId);
      this.loadProvinces(countryId);
    });

    this.createCampusForm.get('provinceId')?.valueChanges.subscribe(provinceId => {
      this.createCampusForm.get('cityId')?.reset('');
      if (!provinceId) {
        this.citiesDD = [];
        return;
      }
      LoggerUtil.log(this.MODULE, 'Province', '🔄 Province changed', provinceId);
      this.loadCities(provinceId);
    });

    LoggerUtil.groupEnd();
  }

  toggleActive(): void {
    const currentValue = this.createCampusForm.get('active')?.value;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '🔄 Toggling active', !currentValue);
    this.createCampusForm.get('active')?.setValue(!currentValue);
  }

  goToCampusListing(): void {
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to campus list');
    this.router.navigate(ROUTES.CAMPUS.LIST);
  }

  onSubmit(): void {
    LoggerUtil.group(`🚀 [${this.MODULE}] Submit`);
    LoggerUtil.log(this.MODULE, 'Submit', '📋 Form submit triggered');

    if (this.createCampusForm.invalid) {
      this.createCampusForm.markAllAsTouched();
      LoggerUtil.error(this.MODULE, 'Submit', '❌ Form validation failed', this.createCampusForm.errors);
      LoggerUtil.groupEnd();
      return;
    }

    LoggerUtil.log(this.MODULE, 'Submit', '📤 Submitting form data', this.createCampusForm.getRawValue());

    this.isLoading = true;
    this.loadingMessage = this.isEditMode ? 'Updating Campus Details...' : 'Adding New Campus...';
    this.campusManagementService.saveCampus(this.campusId, this.createCampusForm.getRawValue())
      .subscribe({
        next: (response: any) => {
          LoggerUtil.log(this.MODULE, 'Submit', '✅ Save successful', response.body);
          const message = response?.body?.message || (this.isEditMode ? 'Campus updated successfully' : 'Campus created successfully');
          this.toaster?.show(message, 'success');
          setTimeout(() => {
            this.router.navigate(ROUTES.CAMPUS.LIST);
          }, 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.loadingMessage = '';
          LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', error);
          this.toaster?.show('Failed to save campus details.', 'error');
        },
        complete: () => {
          this.isLoading = false;
          this.loadingMessage = '';
          LoggerUtil.log(this.MODULE, 'Submit', '🔚 Submit flow completed');
          LoggerUtil.groupEnd(); // Close Submit group
        }
      });
  }

  private loadProvinces(countryId: any, callback?: () => void) {
    LoggerUtil.log(this.MODULE, 'Province', '📌 Fetching provinces for country', countryId);
    this.isLoading = true;
    this.loadingMessage = 'Loading Provinces...';
    this.schoolProfileService.getProvincesByCountryId(countryId).subscribe({
      next: (response) => {
        this.provinceDD = response.body.map((item: any) => ({
          key: item.id,
          label: item.name
        }));
        LoggerUtil.log(this.MODULE, 'Province', '✅ Provinces loaded', this.provinceDD.length);
      },
      error: (error: any) => {
        LoggerUtil.error(this.MODULE, 'Province', '❌ Failed to load provinces', error);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
        callback?.();
      }
    });
  }

  private loadCities(provinceId: any, callback?: () => void) {
    LoggerUtil.log(this.MODULE, 'City', '📌 Fetching cities for province', provinceId);
    this.isLoading = true;
    this.loadingMessage = 'Loading Cities...';
    this.schoolProfileService.getCitiesByProvinceId(provinceId).subscribe({
      next: (response) => {
        this.citiesDD = response.body.map((item: any) => ({
          key: item.id,
          label: item.name
        }));
        LoggerUtil.log(this.MODULE, 'City', '✅ Cities loaded', this.citiesDD.length);
      },
      error: (error: any) => {
        LoggerUtil.error(this.MODULE, 'City', '❌ Failed to load cities', error);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
        callback?.();
      }
    });
  }


  loadCampusDetails(campusId: string): void {
    LoggerUtil.log(this.MODULE, 'Details', '📌 Fetching campus by ID', campusId);
    this.isLoading = true;
    this.campusManagementService.getCampusById(campusId).subscribe({
      next: (response) => {
        const data = response.body;
        LoggerUtil.log(this.MODULE, 'Details', '✅ Campus data loaded', data);

        // Patch non-cascading fields first
        this.createCampusForm.patchValue({
          instituteId: data.instituteId,
          instituteName: data.instituteName,
          campusName: data.campusName,
          campusCode: data.campusCode,
          active: data.active,
          contactNumber: data.contactNumber,
          email: data.email,
          website: data.website,
          address: data.address,
          countryId: data.countryId
        }, { emitEvent: false });

        // Load Cascading Dropdowns sequentially
        this.loadProvinces(data.countryId, () => {
          this.createCampusForm.get('provinceId')?.setValue(data.provinceId, { emitEvent: false });
          this.loadCities(data.provinceId, () => {
            this.createCampusForm.get('cityId')?.setValue(data.cityId, { emitEvent: false });
            LoggerUtil.log(this.MODULE, 'Details', '✅ All cascading fields restored');
          });
        });
      },
      error: (error: any) => {
        LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load campus details', error);
      },
      complete: () => this.isLoading = false
    });
  }


  // getters
  get campusName() { return this.createCampusForm.get('campusName'); }
  get contactNumber() { return this.createCampusForm.get('contactNumber'); }
  get email() { return this.createCampusForm.get('email'); }
  get countryId() { return this.createCampusForm.get('countryId'); }
  get provinceId() { return this.createCampusForm.get('provinceId'); }
  get cityId() { return this.createCampusForm.get('cityId'); }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createCampusForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }


  validationMessages = {
    campusName: {
      required: 'Campus Name is required.',
      maxlength: 'Campus Name cannot exceed 150 characters.',
      whitespace: 'Campus Name cannot be empty or whitespace only.'
    },
    contactNumber: {
      required: 'Contact Number is required.',
      maxlength: 'Contact Number cannot exceed 15 digits.',
      pattern: 'Contact Number must be valid.',
      whitespace: 'Contact Number cannot be empty.'
    },
    email: {
      required: 'Email is required.',
      email: 'Email must be valid.',
      whitespace: 'Email cannot be empty.'
    },
    provinceId: { required: 'Province is required.' },
    cityId: { required: 'City is required.' },
    countryId: { required: 'Country is required.' },
    campusCode: {
      maxlength: 'Campus Code cannot exceed 20 characters.',
      whitespace: 'Campus Code cannot be empty.'
    },
    address: {
      maxlength: 'Address cannot exceed 500 characters.',
      whitespace: 'Address cannot be empty.'
    }
  };
}


// 📌 — important info/start of action // ⚙️ — initializing component/form // 🔄 — subscription/change event // 📤 — sending data // 📦 — data loaded // ✅ — success // ❌ — error // 🔚 — end of flow // ➡️ — navigation // 🏙️ / 🏫 — cities / campus related