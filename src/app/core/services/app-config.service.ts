import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { HTTP_METHOD } from '../const/HTTP_METHOD';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AcademicYearResponse } from '../../features/tenant-management/models/AcademicYearResponse';
import { API_ENDPOINTS } from '../const/API_ENDPOINTS';
import { KeyValueOption } from '../models/KeyValueOption';
import { SmsUtil } from '../utils/smsUtil';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private config: any = {};
  private academicYearData: AcademicYearResponse | null = null;
  private employeeLookUpData: any = null;

  docsTypeDD: KeyValueOption[] = [];
  addressTypeDD: KeyValueOption[] = [];
  countriesDD: KeyValueOption[] = [];
  relationshipTypeDD: KeyValueOption[] = [];
  degreeDD: KeyValueOption[] = [];
  subjects: KeyValueOption[] = [];
  genderDD: KeyValueOption[] = [];
  maritalStatusDD: KeyValueOption[] = [];
  bloodGroupDD: KeyValueOption[] = [];
  religionDD: KeyValueOption[] = [];
  nationalityDD: KeyValueOption[] = [];

  constructor(
    private httpClientService: HttpClientService,
    private http: HttpClient
  ) { }

  /**
   * Load config from local JSON file
   */
  loadConfig(): void {
    console.group('📥 Loading Local Config');
    this.httpClientService.request<any>(HTTP_METHOD.GET, '/assets/config/config.json', { observeResponse: true })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('%c✅ Local config loaded', 'color: green; font-weight: bold;');
          console.log('Status:', response.status);
          console.log('Body:', response.body);
          this.config = response.body;
        },
        error: (error) => {
          console.error('%c❌ Failed to load local config', 'color: red; font-weight: bold;');
          console.error('Status:', error.status);
          console.error('Message:', error.message);
        },
        complete: () => console.log('🔚 Local config load complete')
      });
    console.groupEnd();
  }

  /**
   * Load config + backend static data
   */
  async loadConfig_(): Promise<void> {
    console.group('🚀 App Startup Initialization');

    try {
      // Load local config first
      const response = await firstValueFrom(
        this.httpClientService.request<any>(HTTP_METHOD.GET, '/assets/config/config.json', { observeResponse: true })
      );
      this.config = response.body;
      console.group('📦 Config Loaded');
      console.log('Status:', response.status);
      console.log('Config:', response.body);
      console.groupEnd();

      // Fetch backend static data
      console.group('🌐 Loading Backend Static Data');

      const data = await firstValueFrom(
        forkJoin({
          academicYear: this.http.get<AcademicYearResponse>(`${this.apiBaseUrl}/api/school/academic/current`)
            .pipe(
              catchError(err => {
                console.error('%c❌ Failed to fetch academic year', 'color: red; font-weight: bold;', err);
                // fallback default academic year
                return of({
                  id: 0,
                  name: 'Default Year',
                  startDate: new Date().toISOString(),
                  endDate: new Date().toISOString(),
                  isCurrent: true
                } as AcademicYearResponse);
              })
            ),
          employeeLookUp: this.http.request<any>(HTTP_METHOD.GET, `${this.apiBaseUrl}${API_ENDPOINTS.LOOKUP.EMPLOYEE_DOCS_META}`)
            .pipe(
              catchError(err => {
                console.error('%c❌ Failed to fetch employee lookup data', 'color: red; font-weight: bold;', err);
                return of({});
              })
            )
        })
      );

      // Assign backend data
      this.academicYearData = data.academicYear;
      this.employeeLookUpData = data.employeeLookUp;

      console.group('✅ Backend Data Loaded');
      console.log('Academic Year:', this.academicYearData);
      console.log('Lookup Data:', this.employeeLookUpData);
      console.groupEnd();

      // Map dropdowns
      console.group('📌 Mapping Dropdowns');

      this.docsTypeDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.docs ?? []);
      console.log('docsTypeDD:', this.docsTypeDD);

      this.genderDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.gender ?? []);
      console.log('genderDD:', this.genderDD);

      this.maritalStatusDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.maritalStatus ?? []);
      console.log('maritalStatusDD:', this.maritalStatusDD);

      this.bloodGroupDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.bloodGroup ?? []);
      console.log('bloodGroupDD:', this.bloodGroupDD);

      this.religionDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.religions ?? []);
      console.log('religionDD:', this.religionDD);

      this.nationalityDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.nationality ?? []);
      console.log('nationalityDD:', this.nationalityDD);

      this.addressTypeDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.addressType ?? []);
      console.log('addressTypeDD:', this.addressTypeDD);

      this.relationshipTypeDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.relationshipType ?? []);
      console.log('relationshipTypeDD:', this.relationshipTypeDD);

      this.degreeDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.degree ?? []);
      console.log('degreeDD:', this.degreeDD);

      this.subjects = SmsUtil.mapToKeyValue(this.employeeLookUpData?.subjects ?? []);
      console.log('subjects:', this.subjects);

      this.countriesDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.countries ?? []);
      console.log('countriesDD:', this.countriesDD);

      console.groupEnd(); // dropdowns
      console.groupEnd(); // backend data

    } catch (err) {
      console.error('%c❌ App config initialization failed', 'color: red; font-weight: bold;', err);
    }

    console.groupEnd(); // app startup
  }

  /** Base API URL */
  get apiBaseUrl(): string {
    return this.config?.TENANT_SERVICE_BASE_URL || '';
  }

  /** Get current academic year */
  getAcademicYear(): AcademicYearResponse | null {
    return this.academicYearData;
  }

  /** Is dummy data enabled */
  get dummyDataEnablement(): boolean {
    return this.config?.ENABLE_DUMMAY_DATA || false;
  }

}
