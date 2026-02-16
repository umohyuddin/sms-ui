import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamCreateFormComponent } from '../../components/exam-create-form/exam-create-form.component';

@Component({
    selector: 'app-exam-mgmt-create',
    standalone: true,
    imports: [CommonModule, ExamCreateFormComponent],
    templateUrl: './exam-create.html',
})
export class ExamMgmtCreatePage implements OnInit {

    constructor() { }

    ngOnInit(): void { }
}
