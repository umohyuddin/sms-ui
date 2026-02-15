import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamTypeCreateFormComponent } from '../../components/exam-type-create-form/exam-type-create-form.component';

@Component({
    selector: 'app-exam-type-create',
    standalone: true,
    imports: [CommonModule, ExamTypeCreateFormComponent],
    templateUrl: './exam-type-create.html'
})
export class ExamTypeCreate {
    constructor() { }
}
