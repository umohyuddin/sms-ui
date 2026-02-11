import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { HTTP_METHOD } from '../../../core/const/HTTP_METHOD';
import { API_ENDPOINTS } from '../../../core/const/API_ENDPOINTS';
import { CampusManagementService } from '../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../standard-management/services/standard-management.service';
import { AcademicYearManagementService } from '../../tenant-management/services/academic-year-management.service';
import { AcademicManagementService } from '../../academic-management/services/academic-management.service';

@Injectable({
    providedIn: 'root'
})
export class StandardSubjectMappingService {
    constructor(
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private academicYearService: AcademicYearManagementService,
        private academicService: AcademicManagementService
    ) { }

    getCampuses(): Observable<any> {
        return this.campusService.getAllCampuses();
    }

    getStandardsByCampus(campusId: string): Observable<any> {
        return this.standardService.getCampusById(campusId);
    }

    getAcademicYears(): Observable<any> {
        return this.academicYearService.getAcademicYears();
    }

    getSubjects(): Observable<any> {
        return this.academicService.getSubjects();
    }

    getStandardSubjects(standardId: string | number, academicYearId: string | number): Observable<any> {
        return this.academicService.getStandardSubjects(standardId, academicYearId);
    }

    assignSubject(payload: any): Observable<any> {
        return this.academicService.assignSubjectToStandard(payload);
    }

    unassignSubject(standardId: string | number, subjectId: string | number, academicYearId: string | number): Observable<any> {
        return this.academicService.unassignSubjectFromStandard(standardId, subjectId, academicYearId);
    }
}
