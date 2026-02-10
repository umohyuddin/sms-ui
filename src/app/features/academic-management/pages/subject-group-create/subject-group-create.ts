import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectGroupCreateFormComponent } from '../../components/subject-group-create-form/subject-group-create-form.component';

@Component({
    selector: 'app-subject-group-create',
    standalone: true,
    imports: [CommonModule, SubjectGroupCreateFormComponent],
    templateUrl: './subject-group-create.html'
})
export class SubjectGroupCreate {
    constructor() { }
}
