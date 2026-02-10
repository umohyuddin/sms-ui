import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SubjectManagementService } from '../../services/subject-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { Subject } from '../../models/subject.model';

@Component({
    selector: 'app-subject-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './subject-info.component.html'
})
export class SubjectInfoComponent implements OnInit {
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
                this.subjectData = resp.body;
                this.logger.success('Subject details loaded successfully');
            },
            error: (err) => {
                this.logger.error('Failed to load subject details', err);
            }
        });
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
