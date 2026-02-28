import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultProcessingService } from '../../services/result-processing.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-result-processing',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './result-processing.html'
})
export class ResultProcessingPage implements OnInit {
    filters = { campusId: '', standardId: '', sectionId: '', examTermId: '' };
    campuses: any[] = [];
    standards: any[] = [];
    sections: any[] = [];
    examTerms: any[] = [];
    loading = false;
    processing = false;
    resultSummary: any = null;
    currentAcademicYear: any = null;

    constructor(
        private academicService: ResultProcessingService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private academicYearService: AcademicYearManagementService
    ) { }

    ngOnInit(): void {
        this.loadInitialData();
    }

    loadInitialData() {
        this.loading = true;
        // Load Campuses
        this.campusService.getAllCampuses().subscribe((resp: HttpResponse<any>) => {
            this.campuses = resp.body || [];
        });

        // Load Current Academic Year and its Exam Terms
        this.academicYearService.getCurrentAcademicYear().subscribe((yearResp: HttpResponse<any>) => {
            this.currentAcademicYear = yearResp.body;
            if (this.currentAcademicYear) {
                this.academicService.getExamTerms(this.currentAcademicYear.id).subscribe((termsResp: HttpResponse<any>) => {
                    this.examTerms = termsResp.body || [];
                    this.loading = false;
                });
            } else {
                this.loading = false;
            }
        });
    }

    onCampusChange() {
        this.filters.standardId = '';
        this.filters.sectionId = '';
        this.standards = [];
        this.sections = [];
        if (this.filters.campusId) {
            this.standardService.getStandardsByCampusId(this.filters.campusId).subscribe((resp: HttpResponse<any>) => {
                this.standards = resp.body || [];
            });
        }
    }

    onStandardChange() {
        this.filters.sectionId = '';
        this.sections = [];
        if (this.filters.standardId) {
            this.standardService.getSectionsByStandardId(this.filters.standardId).subscribe((resp: HttpResponse<any>) => {
                this.sections = resp.body || [];
            });
        }
    }

    processResults() {
        if (!this.filters.standardId || !this.filters.sectionId || !this.filters.examTermId) {
            return;
        }

        this.processing = true;
        this.academicService.processResults(+this.filters.standardId, +this.filters.sectionId, +this.filters.examTermId).subscribe({
            next: (resp) => {
                // The provided endpoint returns "Results processing initiated"
                // But we show a summary for UX completeness based on previous logic
                this.resultSummary = {
                    status: 'success',
                    message: resp.body || 'Results processing initiated successfully'
                };
                this.processing = false;
            },
            error: (err) => {
                console.error('Error processing results:', err);
                this.processing = false;
            }
        });
    }

    resetFilters() {
        this.filters = { campusId: '', standardId: '', sectionId: '', examTermId: '' };
        this.standards = [];
        this.sections = [];
        this.resultSummary = null;
    }
}
