import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { AppConfigService } from '../../../core/services/app-config.service';
import { HttpClientService } from '../../../core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolProfileManagementService {

  private baseUrl = '';

  constructor(
    private http: HttpClientService,
    private appConfig: AppConfigService
  ) {
    this.baseUrl = this.appConfig.apiBaseUrl;
    console.log('API Base URL:', this.baseUrl);
  }

  getInstitute(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.PROFILE.GET}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  updateInstitute(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.PROFILE.UPDATE}`;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true,
      body: payload
    });
  }
  getCurrentAcademicYear(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACADEMIC_YEAR.GET_CURRENT}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getProvincesByCountryId(countryId: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.LOOKUP.PROVINCE.GET_BY_COUNTRY_ID(countryId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getCitiesByProvinceId(provinceId: number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CITY.GET_BY_PROVINCE_ID(provinceId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  createInstituteContact(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.CREATE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  createInstituteSocialLink(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.SOCIAL_LINKS.CREATE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  createInstituteBoardMember(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.BOARD_MEMBERS.CREATE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  createInstituteAccreditation(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACCREDITATIONS.CREATE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  updateInstituteContact(id: string | number, payload: any, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.UPDATE(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true,
      body: payload
    });
  }

  updateInstituteSocialLink(id: string | number, payload: any, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.SOCIAL_LINKS.UPDATE(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true,
      body: payload
    });
  }

  updateInstituteBoardMember(id: string | number, payload: any, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.BOARD_MEMBERS.UPDATE(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true,
      body: payload
    });
  }

  updateInstituteAccreditation(id: string | number, payload: any, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACCREDITATIONS.UPDATE(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true,
      body: payload
    });
  }

  getInstituteContacts(instituteId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.GET_ALL}?instituteId=${instituteId}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteSocialLinks(instituteId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.SOCIAL_LINKS.GET_ALL}?instituteId=${instituteId}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteBoardMembers(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.BOARD_MEMBERS.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteContactsByInstituteId(instituteId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.GET_BY_INSTITUTE_ID(instituteId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteSocialLinksByInstituteId(instituteId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.SOCIAL_LINKS.GET_BY_INSTITUTE_ID(instituteId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteBoardMembersByInstituteId(instituteId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.BOARD_MEMBERS.GET_BY_INSTITUTE_ID(instituteId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteAccreditationsByInstituteId(instituteId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACCREDITATIONS.GET_BY_INSTITUTE_ID(instituteId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteContactById(id: string | number, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.GET_BY_ID(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteSocialLinkById(id: string | number, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.SOCIAL_LINKS.GET_BY_ID(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteBoardMemberById(id: string | number, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.BOARD_MEMBERS.GET_BY_ID(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteAccreditationById(id: string | number, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACCREDITATIONS.GET_BY_ID(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  deleteInstituteContact(id: string | number, organizationId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.DELETE(id)}`;
    const url = organizationId ? `${baseUrl}?organizationId=${organizationId}` : baseUrl;
    return this.http.request(HTTP_METHOD.DELETE, url, {
      observeResponse: true
    });
  }

  deleteInstituteSocialLink(id: string | number, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.SOCIAL_LINKS.DELETE(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.DELETE, url, {
      observeResponse: true
    });
  }

  deleteInstituteBoardMember(id: string | number, organizationId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.BOARD_MEMBERS.DELETE(id)}`;
    const url = organizationId ? `${baseUrl}?organizationId=${organizationId}` : baseUrl;
    return this.http.request(HTTP_METHOD.DELETE, url, {
      observeResponse: true
    });
  }

  deleteInstituteAccreditation(id: string | number, instituteId?: string | number): Observable<any> {
    const baseUrl = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACCREDITATIONS.DELETE(id)}`;
    const url = instituteId ? `${baseUrl}?instituteId=${instituteId}` : baseUrl;
    return this.http.request(HTTP_METHOD.DELETE, url, {
      observeResponse: true
    });
  }

  uploadInstituteDocs(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DOCUMENTS.UPLOAD_DOCS}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  getInstituteDocs(id: string | number): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DOCUMENTS.GET_INSTITUTE_DOCS(id)}`, { observeResponse: true });
  }

  getDocsMeta(): Observable<any> {
    return this.http.request(HTTP_METHOD.GET, `${this.baseUrl}${API_ENDPOINTS.LOOKUP.EMPLOYEE_DOCS_META}`, { observeResponse: true });
  }

  getFeeRecurrenceRules(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FEE_RECURRENCE_RULES.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  downloadInstituteDocument(documentId: number, instituteId: string, fileName: string, fileType: string): void {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.DOCUMENTS.DOWNLOAD_DOCS}/${documentId}?instituteId=${instituteId}`;

    (this.http.request('GET', url, { responseType: 'blob' } as any) as Observable<Blob>)
      .subscribe({
        next: (blob) => {
          const link = document.createElement('a');
          const objectUrl = window.URL.createObjectURL(blob);
          link.href = objectUrl;
          link.download = fileName || `document_${documentId}`;
          link.click();
          window.URL.revokeObjectURL(objectUrl);
        },
        error: (err) => console.error('Error downloading document', err)
      });
  }

  searchInstituteContacts(instituteId: string | number, keyword: string): Observable<any> {
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.SEARCH(keyword)}&instituteId=${instituteId}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.CONTACTS.GET_ALL}?instituteId=${instituteId}`;

    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  searchInstituteSocialLinks(instituteId: string | number, keyword: string): Observable<any> {
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.SOCIAL_LINKS.SEARCH(keyword)}&instituteId=${instituteId}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.SOCIAL_LINKS.GET_ALL}?instituteId=${instituteId}`;

    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  searchInstituteBoardMembers(keyword: string): Observable<any> {
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.BOARD_MEMBERS.SEARCH(keyword)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.BOARD_MEMBERS.GET_ALL}`;

    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  searchInstituteAccreditations(instituteId: string | number, keyword: string): Observable<any> {
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACCREDITATIONS.SEARCH(keyword)}&instituteId=${instituteId}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACCREDITATIONS.GET_BY_INSTITUTE_ID(instituteId)}`;

    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  activateAccreditation(id: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACCREDITATIONS.ACTIVATE(id)}`;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true
    });
  }

  deactivateAccreditation(id: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.ACCREDITATIONS.DEACTIVATE(id)}`;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true
    });
  }

  getFinancialSettings(instituteId: string | number, academicYearId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FINANCIAL_SETTINGS.GET(instituteId, academicYearId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  createFinancialSettings(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FINANCIAL_SETTINGS.CREATE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  updateFinancialSettings(id: string | number, payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FINANCIAL_SETTINGS.UPDATE(id)}`;
    return this.http.request(HTTP_METHOD.PUT, url, {
      observeResponse: true,
      body: payload
    });
  }

  getCurrencies(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.LOOKUP.CURRENCY.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  getTaxTypes(countryId: number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.LOOKUP.TAX_TYPE.GET_BY_COUNTRY(countryId)}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  // Facility Types methods
  getFacilityTypes(): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.LOOKUP.FACILITY_TYPES.GET_ALL}`;
    return this.http.request(HTTP_METHOD.GET, url, { observeResponse: true });
  }

  // Institute Facilities methods
  getInstituteFacilitiesByInstituteId(instituteId: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FACILITIES.GET_BY_INSTITUTE_ID(instituteId)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  getInstituteFacilityById(id: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FACILITIES.GET_BY_ID(id)}`;
    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }

  createFacilities(payload: any): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FACILITIES.CREATE}`;
    return this.http.request(HTTP_METHOD.POST, url, {
      observeResponse: true,
      body: payload
    });
  }

  saveFacility(id: string | number | null, payload: any): Observable<any> {
    const isUpdate = !!id;
    const method = isUpdate ? HTTP_METHOD.PUT : HTTP_METHOD.POST;
    const url = isUpdate
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FACILITIES.UPDATE(id)}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FACILITIES.CREATE}`;

    return this.http.request(method, url, {
      observeResponse: true,
      body: payload
    });
  }

  deleteFacility(id: string | number): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FACILITIES.DELETE(id)}`;
    return this.http.request(HTTP_METHOD.DELETE, url, {
      observeResponse: true
    });
  }

  searchFacilities(instituteId: string | number, keyword: string): Observable<any> {
    const url = keyword
      ? `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FACILITIES.SEARCH(keyword)}&instituteId=${instituteId}`
      : `${this.baseUrl}${API_ENDPOINTS.INSTITUTE.FACILITIES.GET_BY_INSTITUTE_ID(instituteId)}`;

    return this.http.request(HTTP_METHOD.GET, url, {
      observeResponse: true
    });
  }
  

}