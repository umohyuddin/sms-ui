import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectInfoComponent } from '../../components/subject-info/subject-info.component';

@Component({
    selector: 'app-subject-details',
    standalone: true,
    imports: [CommonModule, SubjectInfoComponent],
    templateUrl: './subject-details.html'
})
export class SubjectDetails {
    constructor() { }
}
