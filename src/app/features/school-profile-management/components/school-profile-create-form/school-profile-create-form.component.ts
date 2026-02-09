import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { EmployeeManagementService } from '../../../employee-management/services/employee-management.service';
import { InstituteResponse } from '../../models/InstituteResponse';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { CommonModule } from '@angular/common';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-school-profile-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './school-profile-create-form.component.html',
  styleUrl: './school-profile-create-form.component.css'
})
export class SchoolProfileCreateFormComponent {
  profileForm!: FormGroup;
  profile?: InstituteResponse;
  routedId!: string;
  countriesDD: KeyValueOption[] = [];
  provinceDD: KeyValueOption[] = [];
  citiesDD: KeyValueOption[] = [];
  editingAddressId: any;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private schoolProfileManagementService: SchoolProfileManagementService,
    private lookupData: EmployeeManagementService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService,
    private httpClientService: HttpClientService,
  ) { }



  ngOnInit(): void {
    this.countriesDD = this.appConfig.countriesDD;
    this.initializeForm();
    this.setupFormListeners();
    this.getProfileDetails();
  }



  private initializeForm() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^(?!\s*$).+/)]],
      tagLine: ['', Validators.maxLength(150)],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.maxLength(20), Validators.pattern(/^\+?[0-9\s\-()]*$/)]],
      website: ['', Validators.pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/)],
      establishedDate: [null],
      address: ['', Validators.maxLength(300)],

      countryId: ['', Validators.required],
      provinceId: ['', Validators.required],
      cityId: ['', Validators.required],
    }); this.setupFormListeners();
  }


  private setupFormListeners() {
    this.profileForm.get('countryId')?.valueChanges.subscribe(countryId => {
      this.loadProvinceByCountryId(countryId);
    });

    this.profileForm.get('provinceId')?.valueChanges.subscribe(provinceId => {
      this.loadCitiesByProvince(provinceId);
    });
  }

  getProfileDetails(): void {
    this.schoolProfileManagementService.getInstitute().subscribe({
      next: (response) => {
        console.log('%c✅ Request Successful', 'color: green; font-weight: bold;');
        console.log('Employee Response:', { status: response.status, data: response.body });
        this.profile = response.body;
        this.profileForm.patchValue(response.body as InstituteResponse);
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

  goToProfileListig() {
    this.router.navigate(ROUTES.SCHOOL_PROFILE.LIST)
  }

  employeeLookUpData() {
    console.group('📦 Fetching Lookup Data');
    this.lookupData.getDocsMeta()
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

  private loadProvinceByCountryId(countryId: any, callback?: () => void) {
    this.profileForm.get('provinceId')?.setValue('');
    this.schoolProfileManagementService.getProvincesByCountryId(countryId).subscribe({
      next: (response) => {
        this.provinceDD = response.body.map((item: any) => ({
          key: item.id,
          label: item.name
        }));
      },
      error: (error) => console.error(error),
      complete: () => callback?.()
    });
  }

  private loadCitiesByProvince(provinceId: any, callback?: () => void) {
    if (!provinceId) return;
    this.profileForm.get('cityId')?.setValue('');
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
      },
      error: (error) => console.error(error),
      complete: () => callback?.()
    });
  }


  private getInvalidControls(): string[] {
    const invalid: string[] = [];
    const controls = this.profileForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  onSubmit(): void {
    console.group('➡️ Submitting Employee Address Form');
    console.info('Form Data:', this.profileForm.getRawValue());

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      console.warn('❌ Employee form is invalid', {
        invalidControls: this.getInvalidControls(),
        formValue: this.profileForm.getRawValue()
      });
      return;
    }


    this.schoolProfileManagementService.updateInstitute(this.profileForm?.getRawValue()).subscribe({
      next: (response) => {
        this.profile = response.body;
        this.router.navigate(ROUTES.SCHOOL_PROFILE.LIST)
      },
      error: (error) => {
        console.error(`❌ Failed to update the profile`, {
          status: error.status,
          message: error.message,
          formData: this.profileForm.getRawValue()
        });
      },
      complete: () => {
        console.log('🔚 Employee address form submission complete');
        console.groupEnd();
      }
    });
  }


  isInvalid(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty)
    );
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.profileForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) {
        return this.validationMessages[controlName][key];
      }
    }

    return '';
  }


  validationMessages = {
    name: {
      required: 'School name is required.',
      maxlength: 'School name cannot exceed 100 characters.',
      pattern: 'School name cannot be empty or whitespace only.'
    },

    tagLine: {
      maxlength: 'Tagline cannot exceed 150 characters.'
    },

    email: {
      required: 'Email is required.',
      email: 'Please enter a valid email address.'
    },

    contactNumber: {
      maxlength: 'Contact number cannot exceed 20 characters.',
      pattern: 'Invalid phone number format.'
    },

    website: {
      pattern: 'Please enter a valid website URL.'
    },

    address: {
      maxlength: 'Address cannot exceed 300 characters.'
    },

    countryId: {
      required: 'Country is required.'
    },

    provinceId: {
      required: 'Province is required.'
    },

    cityId: {
      required: 'City is required.'
    }
  };



  get name() { return this.profileForm.get('name'); }
  get email() { return this.profileForm.get('email'); }
  get contactNumber() { return this.profileForm.get('contactNumber'); }
  get website() { return this.profileForm.get('website'); }
  get tagLine() { return this.profileForm.get('tagLine'); }
  get address() { return this.profileForm.get('address'); }
  get countryId() { return this.profileForm.get('countryId'); }
  get provinceId() { return this.profileForm.get('provinceId'); }
  get cityId() { return this.profileForm.get('cityId'); }
}
