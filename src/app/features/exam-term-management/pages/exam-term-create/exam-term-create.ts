import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamTermCreateFormComponent } from '../../components/exam-term-create-form/exam-term-create-form.component';

@Component({
    selector: 'app-exam-term-create',
    standalone: true,
    imports: [CommonModule, ExamTermCreateFormComponent],
    templateUrl: './exam-term-create.html'
})
export class ExamTermCreate {
    constructor() { }
}
