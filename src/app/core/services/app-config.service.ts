import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { HTTP_METHOD } from '../const/HTTP_METHOD';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom, forkJoin } from 'rxjs';
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
  relationshipTypeDD: KeyValueOption[] = [];
  degreeDD: KeyValueOption[] = [];
  subjects: KeyValueOption[] = [];
  genderDD: KeyValueOption[] = [];
  maritalStatusDD: KeyValueOption[] = [];
  bloodGroupDD: KeyValueOption[] = [];
  religionDD: KeyValueOption[] = [];
  nationalityDD: KeyValueOption[] = [];



  constructor(private httpClientService: HttpClientService,
    private http: HttpClient
  ) { }

  loadConfig(): void {

    this.httpClientService.request<any>(HTTP_METHOD.GET, '/assets/config/config.json', { observeResponse: true }).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('  Status:', response.status);
        console.log('📦 Body:', response.body);
        this.config = response.body
      },
      error: (error) => {
        console.error('❌ Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Delete Complete');
      }
    });
  }


  loadConfig_(): Promise<void> {
    console.group('App Startup Initialization');
    return firstValueFrom(
      this.httpClientService.request<any>(HTTP_METHOD.GET, '/assets/config/config.json', { observeResponse: true })
    ).then(response => {
      this.config = response.body;
      console.group('📦 Config Loaded');
      console.log('Status:', response.status);
      console.log('Config:', response.body);
      console.groupEnd();

      // Now fetch backend static data using loaded apiBaseUrl
      console.group('🌐 Loading Backend Static Data');
      return firstValueFrom(
        forkJoin({
          academicYear: this.http.get<AcademicYearResponse>(`${this.apiBaseUrl}/api/school/academic/current`),
          employeeLookUp: this.http.request<any>(HTTP_METHOD.GET, `${this.apiBaseUrl}${API_ENDPOINTS.LOOKUP.EMPLOYEE_DOCS_META}`)


        })
      );
    }).then(data => {


      this.academicYearData = data.academicYear;
      this.employeeLookUpData = data.employeeLookUp;
      // Mapping dropdowns
      this.docsTypeDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.docs ?? []);
      this.genderDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.gender ?? []);
      this.maritalStatusDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.maritalStatus ?? []);
      this.bloodGroupDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.bloodGroup ?? []);
      this.religionDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.religions ?? []);
      this.nationalityDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.nationality ?? []);
      this.addressTypeDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.addressType ?? []);
      this.relationshipTypeDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.relationshipType ?? []);
      this.degreeDD = SmsUtil.mapToKeyValue(this.employeeLookUpData?.degree ?? []);
      this.subjects = SmsUtil.mapToKeyValue(this.employeeLookUpData?.subjects ?? []);
      console.group('✅ Dropdowns Loaded');
      console.log('docsTypeDD:', this.docsTypeDD);
      console.log('genderDD:', this.genderDD);
      console.log('maritalStatusDD:', this.maritalStatusDD);
      console.log('bloodGroupDD:', this.bloodGroupDD);
      console.log('religionDD:', this.religionDD);
      console.log('nationalityDD:', this.nationalityDD);
      console.log('addressTypeDD:', this.addressTypeDD);
      console.log('relationshipTypeDD:', this.relationshipTypeDD);
      console.log('degreeDD:', this.degreeDD);
      console.log('subjects:', this.subjects);
      console.groupEnd();
    }).catch(err => console.error(err));
  }

  get apiBaseUrl(): string {
    return this.config?.TENANT_SERVICE_BASE_URL || '';
  }
  getAcademicYear(): AcademicYearResponse | null {
    return this.academicYearData;
  }

  get dummyDataEnablement(): boolean {
    return this.config?.ENABLE_DUMMAY_DATA || false;
  }

}
