import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SubjectManagementService } from '../../services/subject-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { Subject } from '../../models/subject.model';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
    selector: 'app-subject-info',
    standalone: true,
    imports: [CommonModule, ToasterComponent],
    templateUrl: './subject-info.component.html'
})
export class SubjectInfoComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    subjectData: Subject | null = null;
    subjectId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private subjectService: SubjectManagementService,
        private logger: LoggerService
    ) { }

    ngOnInit(): void {
        this.logger.group('SubjectInfoComponent');
        this.logger.info('Initializing subject info');

        this.subjectId = this.route.snapshot.paramMap.get('id');
        if (this.subjectId) {
            this.loadSubjectDetails();
        }

        this.logger.groupEnd();
    }

    loadSubjectDetails() {
        this.logger.info('Loading subject details', this.subjectId);
        this.subjectService.getSubjectById(this.subjectId!).subscribe({
            next: (resp) => {
                this.subjectData =resp.body;
                this.logger.success('Subject details loaded successfully');
            },
            error: (err) => {
                this.logger.error('Failed to load subject details', err);
                this.toaster?.show('Failed to load subject details.', 'error');
            }
        });
    }

    private normalizeActive(subject: any): boolean {
        if (subject?.active !== undefined && subject?.active !== null) {
            return this.normalizeBoolean(subject.active);
        }

        if (subject?.isActive !== undefined && subject?.isActive !== null) {
            return this.normalizeBoolean(subject.isActive);
        }

        if (subject?.deleted !== undefined && subject?.deleted !== null) {
            return !this.normalizeBoolean(subject.deleted);
        }

        return false;
    }

    private normalizeBoolean(value: any): boolean {
        if (value === true || value === 'true' || value === 1 || value === '1' || value === 'Y' || value === 'y') {
            return true;
        }

        if (value === false || value === 'false' || value === 0 || value === '0' || value === 'N' || value === 'n') {
            return false;
        }

        return !!value;
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
}
