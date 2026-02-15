import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentTypeCreateFormComponent } from '../../components/assessment-type-create-form/assessment-type-create-form.component';

@Component({
    selector: 'app-assessment-type-create',
    standalone: true,
    imports: [CommonModule, AssessmentTypeCreateFormComponent],
    templateUrl: './assessment-type-create.html'
})
export class AssessmentTypeCreate {
    constructor() { }
}
