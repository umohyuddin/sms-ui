import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SubjectGroupManagementService } from '../../services/subject-group-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { SubjectGroup } from '../../models/subject-group.model';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-subject-group-info',
    standalone: true,
    imports: [CommonModule, ToasterComponent, LoaderComponent],
    templateUrl: './subject-group-info.component.html'
})
export class SubjectGroupInfoComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    groupData: SubjectGroup | null = null;
    groupId: string | null = null;
    loading = false;
    loaderMessage = 'Loading subject group...';

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
        this.loading = true;
        this.subjectGroupService.getSubjectGroupById(this.groupId!).subscribe({
            next: (resp) => {
                this.groupData = resp.body;
                this.logger.success('Subject group details loaded successfully');
            },
            error: (err) => {
                this.toaster?.show('Failed to load subject group details.', 'error');
                this.logger.error('Failed to load subject group details', err);
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
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
