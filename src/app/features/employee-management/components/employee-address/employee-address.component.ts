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
import { LoggerService } from '../../../../core/services/logger.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { HttpClientService } from '../../../../core/services/http-client.service';

@Component({
  selector: 'app-employee-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-address.component.html',
  styleUrl: './employee-address.component.css'
})
export class EmployeeAddressComponent {
  addressForm!: FormGroup;
  employeeAddressData: EmployeeAddress[] = [];
  selectedAddress?: EmployeeAddress;
  routedId!: string;
  activeTab: string = 'overview';
  personalForm!: FormGroup;
  showPersonalForm: boolean = false;
  response?: EmployeeResponse;
  addressTypeDD: KeyValueOption[] = [];
  countriesDD: KeyValueOption[] = [];
  provinceDD: KeyValueOption[] = [];
  citiesDD: KeyValueOption[] = [];
  editingAddressId: any;


  constructor(
    private fb: FormBuilder,
    private employeeManagementService: EmployeeManagementService,

    private route: ActivatedRoute,
    private appConfig: AppConfigService,
    private httpClientService: HttpClientService,
   private logger: LoggerService) { }



  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('employee ID from route:', this.routedId);
    this.addressTypeDD = this.appConfig.addressTypeDD;
    this.countriesDD = this.appConfig.countriesDD;
    this.initializeForm();
    this.setupFormListeners();
    this.getEmployeeAddressDetails(this.routedId);
  }


  togglePersonalForm(id: any) {
    console.log('received Id', id);

    if (id !== null && id !== undefined) {
      this.editingAddressId = id;
      this.getEmployeeAddressById(id);
    } else {
      this.initializeForm();
    }

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
    this.addressForm = this.fb.group({
      addressType: ['', Validators.required],
      provinceId: ['', Validators.required],
      countryId: ['', Validators.required],
      employeeId: [this.routedId, Validators.required],
      addressId: [''],
      cityId: ['', Validators.required],
      postalCode: [''],
      line1: ['', Validators.maxLength(500)],
      line2: ['',]
    });

      this.setupFormListeners();
  }


  private setupFormListeners() {
    this.addressForm.get('countryId')?.valueChanges.subscribe(countryId => {
      this.loadProvinceByCountryId(countryId);
    });

    this.addressForm.get('provinceId')?.valueChanges.subscribe(provinceId => {
      this.loadCitiesByProvince(provinceId);
    });
  }

  getEmployeeAddressDetails(id: string): void {
    console.group(`Fetching Employee Details - ID: ${id}`);
    this.employeeManagementService.getEmployeeAddress(id).subscribe({
      next: (response) => {
        console.log('%c✅ Request Successful', 'color: green; font-weight: bold;');
        console.log('Employee Response:', { status: response.status, data: response.body });
        this.employeeAddressData = response.body;
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

  private loadProvinceByCountryId(countryId: any, callback?: () => void) {
    this.addressForm.get('provinceId')?.setValue('');
    this.employeeManagementService.getProvinceByCountryId(countryId).subscribe({
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
    this.addressForm.get('cityId')?.setValue('');
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


  getEmployeeAddressById(id: number) {
    this.employeeManagementService.getEmployeeAddressById(id).subscribe({
      next: (response) => {
        this.selectedAddress = response.body;

        const selectedCountryId = this.selectedAddress?.countryId;
        const selectedProvinceId = this.selectedAddress?.provinceId;
        const selectedCityId = this.selectedAddress?.cityId;

        // Load provinces first
        this.loadProvinceByCountryId(selectedCountryId, () => {
          // Load cities after provinces
          this.loadCitiesByProvince(selectedProvinceId, () => {
            // Patch form after dropdowns are loaded
            this.addressForm.patchValue({
              addressId: this.selectedAddress?.id,
              employeeId: this.selectedAddress?.employeeId,
              addressType: this.selectedAddress?.addressType,
              line1: this.selectedAddress?.line1,
              line2: this.selectedAddress?.line2,
              postalCode: this.selectedAddress?.postalCode,
              countryId: selectedCountryId,
              provinceId: selectedProvinceId,
              cityId: selectedCityId
            });
          });
        });

      },
      error: (error) => console.error(error)
    });
  }


  private getInvalidControls(): string[] {
    const invalid: string[] = [];
    const controls = this.addressForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  onSubmit(): void {
    console.group('➡️ Submitting Employee Address Form');
    console.info('Form Data:', this.addressForm.getRawValue());

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      console.warn('❌ Employee form is invalid', {
        invalidControls: this.getInvalidControls(),
        formValue: this.addressForm.getRawValue()
      });
      return;
    }

    const addressPayload = this.addressForm.getRawValue();
    const isUpdate = !!addressPayload.addressId; // if addressId exists, it's an update

    const request$ = isUpdate
      ? this.employeeManagementService.updateAddress(addressPayload, addressPayload.addressId)
      : this.employeeManagementService.saveAddress(addressPayload, this.routedId);

    request$.subscribe({
      next: (response) => {
        console.info(`✅ Employee address ${isUpdate ? 'updated' : 'added'} successfully`, {
          status: response.status,
          employee: response.body
        });

        this.response = response.body;

        // Update local employeeAddressData list
        if (isUpdate) {
          // replace the updated address in the list
          const index = this.employeeAddressData.findIndex(addr => addr.id === addressPayload.addressId);
          if (index !== -1) this.employeeAddressData[index] = response.body;
        } else {
          // push new address to the list
          this.employeeAddressData.push(response.body);
        }

        this.togglePersonalForm(null); // hide form
      },
      error: (error) => {
        console.error(`❌ Failed to ${isUpdate ? 'update' : 'add'} employee address`, {
          status: error.status,
          message: error.message,
          formData: this.addressForm.getRawValue()
        });
      },
      complete: () => {
        console.log('🔚 Employee address form submission complete');
        console.groupEnd();
      }
    });
  }



  // loadCitiesByProvince(provinceId: any) {
  //   this.httpClientService.request<any>(HTTP_METHOD.GET, this.appConfig.apiBaseUrl + API_ENDPOINTS.LOOKUP.CITIY.GET_BY_PROVINCE_ID(provinceId), {
  //     observeResponse: true
  //   }).subscribe({
  //     next: (response) => {
  //       console.log('  Success Status:', response.status);
  //       console.log('📦 Response Body:', response.body);
  //       this.citiesDD = response.body.map((item: any) => ({
  //         key: item.id,   // unique key (IMPORTANT for trackBy)
  //         label: item.name
  //       }));
  //     },

  //     error: (error) => {
  //       console.error('❌ Request Error Status:', error.status);
  //       console.error('Message:', error.message);
  //     },
  //     complete: () => {
  //       console.log('🔚 Request Complete');
  //     }
  //   });
  // }
  //getters
  get addressType() { return this.addressForm.get('addressType'); }
  get countryId() { return this.addressForm.get('countryId'); }
  get provinceId() { return this.addressForm.get('provinceId'); }
  get cityId() { return this.addressForm.get('cityId'); }
  get postalCode() { return this.addressForm.get('postalCode'); }
  get line1() { return this.addressForm.get('line1'); }
  get line2() { return this.addressForm.get('line2'); }
}
