import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SubjectGroupManagementService } from '../../services/subject-group-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { SubjectGroup } from '../../models/subject-group.model';

@Component({
    selector: 'app-subject-group-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './subject-group-info.component.html'
})
export class SubjectGroupInfoComponent implements OnInit {
    groupData: SubjectGroup | null = null;
    groupId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private subjectGroupService: SubjectGroupManagementService,
        private logger: LoggerService
    ) { }

    ngOnInit(): void {
        this.logger.group('SubjectGroupInfoComponent');
        this.logger.info('Initializing subject group info');
        
        this.groupId = this.route.snapshot.paramMap.get('id');
        if (this.groupId) {
            this.loadGroupDetails();
        }
        
        this.logger.groupEnd();
    }

    loadGroupDetails() {
        this.logger.info('Loading subject group details', this.groupId);
        this.subjectGroupService.getSubjectGroupById(this.groupId!).subscribe({
            next: (resp) => {
                this.groupData = resp.body;
                this.logger.success('Subject group details loaded successfully');
            },
            error: (err) => {
                this.logger.error('Failed to load subject group details', err);
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
