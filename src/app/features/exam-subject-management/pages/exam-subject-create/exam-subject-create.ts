import { Component } from '@angular/core';
import { ExamSubjectCreateFormComponent } from '../../components/exam-subject-create-form/exam-subject-create-form.component';

@Component({
    selector: 'app-exam-subject-create',
    standalone: true,
    imports: [ExamSubjectCreateFormComponent],
    templateUrl: './exam-subject-create.html',
    styleUrls: ['./exam-subject-create.css']
})
export class ExamSubjectCreate {
    constructor() { }
}
