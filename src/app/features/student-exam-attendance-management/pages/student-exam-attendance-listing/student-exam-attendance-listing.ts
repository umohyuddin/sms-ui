import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentExamAttendanceManagementService, ExamAttendanceSummaryDTO, ExamAttendanceDetailDTO } from '../../services/student-exam-attendance-management.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-student-exam-attendance-listing',
    templateUrl: './student-exam-attendance-listing.html',
    styleUrls: ['./student-exam-attendance-listing.css'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class StudentExamAttendanceListing implements OnInit {
    // State
    currentLevel: 'campus' | 'standard' | 'section' | 'subject' | 'detail' = 'campus';
    isLoading = false;

    // Data
    summaries: ExamAttendanceSummaryDTO[] = [];
    detailedRecords: ExamAttendanceDetailDTO[] = [];

    // Filters & Context
    academicYears: any[] = [];
    selectedYearId: number | null = null;

    context: {
        campus?: { id: number, name: string },
        standard?: { id: number, name: string },
        section?: { id: number, name: string },
        subject?: { id: number, name: string }
    } = {};

    history: any[] = [];

    constructor(
        private router: Router,
        private service: StudentExamAttendanceManagementService,
        private yearService: AcademicYearManagementService
    ) { }

    ngOnInit(): void {
        this.loadYears();
        this.loadCampusSummary();
    }

    private loadYears(): void {
        this.yearService.getAcademicYears().subscribe((resp: HttpResponse<any>) => {
            this.academicYears = resp.body || [];
            if (this.academicYears.length > 0) {
                this.selectedYearId = this.academicYears.find(y => (y.active || y.isCurrent))?.id || this.academicYears[0].id;
            }
        });
    }

    loadCampusSummary(): void {
        this.isLoading = true;
        this.currentLevel = 'campus';
        this.context = {};
        this.history = [];
        this.service.getCampusSummary(this.selectedYearId || undefined)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe((resp: HttpResponse<any>) => {
                const data = resp.body || [];
                this.summaries = data.map((item: any) => ({
                    id: item.groupId,
                    name: item.groupName,
                    totalStudents: item.totalStudents,
                    presentStudents: item.presentCount,
                    absentStudents: item.absentCount,
                    ufmStudents: item.ufmCount,
                    attendancePercentage: item.attendancePercentage
                }));
            });
    }

    drillDownToStandard(campus: Pick<ExamAttendanceSummaryDTO, 'id' | 'name'>): void {
        if (!campus || !campus.id) {
            console.warn('Cannot drill down: Campus ID is missing', campus);
            return;
        }
        this.history.push({ level: this.currentLevel, context: { ...this.context }, summaries: [...this.summaries] });
        this.isLoading = true;
        this.currentLevel = 'standard';
        this.context.campus = { id: campus.id, name: campus.name };
        this.service.getStandardSummary(campus.id, this.selectedYearId || undefined)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe((resp: HttpResponse<any>) => {
                const data = resp.body || [];
                this.summaries = data.map((item: any) => ({
                    id: item.groupId,
                    name: item.groupName,
                    totalStudents: item.totalStudents,
                    presentStudents: item.presentCount,
                    absentStudents: item.absentCount,
                    ufmStudents: item.ufmCount,
                    attendancePercentage: item.attendancePercentage
                }));
            });
    }

    drillDownToSection(standard: Pick<ExamAttendanceSummaryDTO, 'id' | 'name'>): void {
        if (!standard || !standard.id) {
            console.warn('Cannot drill down: Standard ID is missing', standard);
            return;
        }
        this.history.push({ level: this.currentLevel, context: { ...this.context }, summaries: [...this.summaries] });
        this.isLoading = true;
        this.currentLevel = 'section';
        this.context.standard = { id: standard.id, name: standard.name };
        this.service.getSectionSummary(standard.id, this.selectedYearId || undefined)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe((resp: HttpResponse<any>) => {
                const data = resp.body || [];
                this.summaries = data.map((item: any) => ({
                    id: item.groupId,
                    name: item.groupName,
                    totalStudents: item.totalStudents,
                    presentStudents: item.presentCount,
                    absentStudents: item.absentCount,
                    ufmStudents: item.ufmCount,
                    attendancePercentage: item.attendancePercentage
                }));
            });
    }

    drillDownToSubject(section: Pick<ExamAttendanceSummaryDTO, 'id' | 'name'>): void {
        if (!section || !section.id) {
            console.warn('Cannot drill down: Section ID is missing', section);
            return;
        }
        this.history.push({ level: this.currentLevel, context: { ...this.context }, summaries: [...this.summaries] });
        this.isLoading = true;
        this.currentLevel = 'subject';
        this.context.section = { id: section.id, name: section.name };
        this.service.getSubjectSummary(section.id, this.selectedYearId || undefined)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe((resp: HttpResponse<any>) => {
                const data = resp.body || [];
                this.summaries = data.map((item: any) => ({
                    id: item.groupId,
                    name: item.groupName,
                    totalStudents: item.totalStudents,
                    presentStudents: item.presentCount,
                    absentStudents: item.absentCount,
                    ufmStudents: item.ufmCount,
                    attendancePercentage: item.attendancePercentage
                }));
            });
    }

    viewDetailedReport(subject: ExamAttendanceSummaryDTO): void {
        if (!subject || !subject.id) {
            console.warn('Cannot view details: Subject ID is missing', subject);
            return;
        }
        this.history.push({ level: this.currentLevel, context: { ...this.context }, summaries: [...this.summaries] });
        this.isLoading = true;
        this.currentLevel = 'detail';
        this.context.subject = { id: subject.id, name: subject.name };
        this.service.getDetailedReport({ examSubjectId: subject.id })
            .pipe(finalize(() => this.isLoading = false))
            .subscribe((resp: HttpResponse<any>) => this.detailedRecords = resp.body || []);
    }

    goBack(): void {
        if (this.history.length > 0) {
            const previous = this.history.pop();
            this.currentLevel = previous.level;
            this.context = previous.context;
            this.summaries = previous.summaries;
        }
    }

    goToRecordAttendance(): void {
        this.router.navigate(ROUTES.STUDENT_EXAM_ATTENDANCE.CREATE);
    }
}
