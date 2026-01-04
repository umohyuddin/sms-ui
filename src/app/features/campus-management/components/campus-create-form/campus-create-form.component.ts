import { Component } from '@angular/core';
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
import { CampusMetaData } from '../../models/CampusMetaData';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';

@Component({
  selector: 'app-campus-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './campus-create-form.component.html',
  styleUrls: ['./campus-create-form.component.css']
})
export class CampusCreateFormComponent {
  pageConst = PageTexts;
  meta?: CampusMetaData;
  createCampusForm!: FormGroup;
  isEditMode = false;
  campusId: string | null = null;
  campusData: any;
  provinceDD: KeyValueOption[] = [];
  citiesDD: KeyValueOption[] = [];
  private readonly MODULE = 'Campus';
  private readonly COMPONENT = 'CampusForm';

  constructor(
    private fb: FormBuilder,
    private appConfig: AppConfigService,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
    private campusManagementService: CampusManagementService
  ) {}

  ngOnInit() {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing component');

    this.initializeForm();
    this.loadCampusMeta();

    this.campusId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.campusId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    if (this.isEditMode && this.campusId) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, '🔹 Campus ID found', this.campusId);
      this.getCampusDetails(this.campusId);
    }

    this.onProvinceChange();
    LoggerUtil.groupEnd(); // Close Init group
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createCampusForm = this.fb.group({
      instituteId: ['', Validators.required],
      instituteName: ['', Validators.required],
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

  onProvinceChange() {
    LoggerUtil.group(`🌐 [${this.MODULE}] Province Change`);
    LoggerUtil.log(this.MODULE, 'Province', '🔄 Subscribing to province changes');

    this.createCampusForm.get('provinceId')?.valueChanges.subscribe(provinceId => {
      if (!provinceId) return;

      LoggerUtil.group(`📌 Province Selected`);
      LoggerUtil.log(this.MODULE, 'Province', 'Selected Province ID', provinceId);

      this.createCampusForm.get('cityId')?.reset('');
      this.createCampusForm.get('cityId')?.markAsUntouched();
      this.createCampusForm.get('cityId')?.updateValueAndValidity();

      this.loadCitiesByProvince(provinceId);

      LoggerUtil.groupEnd(); // Close Province Selected
    });

    LoggerUtil.groupEnd(); // Close Province Change subscription group
  }

  goToCampusList(): void {
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to /Campuss');
    this.router.navigate(['/Campuss']);
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

    this.campusManagementService.saveCampuse(this.campusId, this.createCampusForm.getRawValue())
      .subscribe({
        next: (response) => {
          LoggerUtil.log(this.MODULE, 'Submit', '✅ Save successful', response.body);
          LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to campus list');
          this.router.navigate(ROUTES.CAMPUS.LIST);
        },
        error: (error) => {
          LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', error);
        },
        complete: () => {
          LoggerUtil.log(this.MODULE, 'Submit', '🔚 Submit flow completed');
          LoggerUtil.groupEnd(); // Close Submit group
        }
      });
  }

  private loadCitiesByProvince(provinceId: any, callback?: () => void) {
    LoggerUtil.group(`🏙️ [${this.MODULE}] Load Cities`);
    LoggerUtil.log(this.MODULE, 'City', '📌 Request started for province', provinceId);

    if (!provinceId) {
      LoggerUtil.log(this.MODULE, 'City', '⚠️ Province ID missing — aborting');
      LoggerUtil.groupEnd();
      return;
    }

    this.httpClientService.request<any>(
      HTTP_METHOD.GET,
      this.appConfig.apiBaseUrl + API_ENDPOINTS.LOOKUP.CITY.GET_BY_PROVINCE_ID(provinceId),
      { observeResponse: true }
    ).subscribe({
      next: (response) => {
        this.citiesDD = response.body.map((item: any) => ({
          key: item.id,
          label: item.name
        }));
        LoggerUtil.log(this.MODULE, 'City', '📦 Cities loaded successfully', this.citiesDD);
      },
      error: (error) => LoggerUtil.error(this.MODULE, 'City', '❌ Failed to load cities', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'City', '🔚 Request completed');
        LoggerUtil.groupEnd(); // Close Load Cities group
        callback?.();
      }
    });
  }

  loadCampusMeta(): void {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Meta`);
    LoggerUtil.log(this.MODULE, 'Meta', '📌 Fetching campus meta');

    this.campusManagementService.getCampusMeta().subscribe({
      next: (response) => {
        this.meta = response.body;
        LoggerUtil.log(this.MODULE, 'Meta', '✅ Meta loaded', this.meta);

        this.provinceDD = this.meta?.provinces.map((item: any) => ({
          key: item.id,
          label: item.name
        })) || [];

        this.createCampusForm.patchValue({
          instituteId: this.meta?.institute.id,
          instituteName: this.meta?.institute.name
        });
      },
      error: (error) => LoggerUtil.error(this.MODULE, 'Meta', '❌ Failed to load meta', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Meta', '🔚 Meta request completed');
        LoggerUtil.groupEnd(); // Close Load Meta group
      }
    });
  }

  getCampusDetails(campusId: string): void {
    LoggerUtil.group(`🏫 [${this.MODULE}] Load Campus Details`);
    LoggerUtil.log(this.MODULE, 'Details', '📌 Fetching campus by ID', campusId);

    this.campusManagementService.getCampusById(campusId).subscribe({
      next: (response) => {
        this.campusData = response.body;
        LoggerUtil.log(this.MODULE, 'Details', '✅ Campus data loaded', this.campusData);

        this.createCampusForm.patchValue(this.campusData, { emitEvent: false });

        this.loadCitiesByProvince(this.campusData.provinceId, () => {
          this.createCampusForm.get('cityId')?.setValue(this.campusData.cityId);
          LoggerUtil.log(this.MODULE, 'Details', '🏙️ City restored in edit mode');
        });
      },
      error: (error) => LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load campus details', error),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Details', '🔚 Campus details flow completed');
        LoggerUtil.groupEnd(); // Close Campus Details group
      }
    });
  }

  goToCampusListing() {
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to campus list');
    this.router.navigate(ROUTES.CAMPUS.LIST);
  }

  // getters
  get campusName() { return this.createCampusForm.get('campusName'); }
  get contactNumber() { return this.createCampusForm.get('contactNumber'); }
  get email() { return this.createCampusForm.get('email'); }
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