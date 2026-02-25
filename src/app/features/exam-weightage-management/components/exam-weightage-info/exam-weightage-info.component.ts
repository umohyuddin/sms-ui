import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { ExamWeightageManagementService } from '../../services/exam-weightage-management.service';
import { ExamWeightageResponse } from '../../models/exam-weightage-response';

@Component({
    selector: 'app-exam-weightage-info',
    standalone: true,
    imports: [CommonModule, MatExpansionModule],
    templateUrl: './exam-weightage-info.component.html',
    styleUrls: ['./exam-weightage-info.component.css']
})
export class ExamWeightageInfoComponent implements OnInit {
    data?: ExamWeightageResponse;
    itemId!: string;

    constructor(
        private service: ExamWeightageManagementService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.itemId = this.route.snapshot.paramMap.get('id') ?? '';
        if (this.itemId) {
            this.getDetails(this.itemId);
        }
    }

    getDetails(id: string): void {
        // Implement getting details logic if service supports it
    }
}
