import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectCreateFormComponent } from '../../components/subject-create-form/subject-create-form.component';

@Component({
    selector: 'app-subject-create',
    standalone: true,
    imports: [CommonModule, SubjectCreateFormComponent],
    templateUrl: './subject-create.html'
})
export class SubjectCreate {
    constructor() { }
}
