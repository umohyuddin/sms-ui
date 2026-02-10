import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectGroupInfoComponent } from '../../components/subject-group-info/subject-group-info.component';

@Component({
    selector: 'app-subject-group-details',
    standalone: true,
    imports: [CommonModule, SubjectGroupInfoComponent],
    templateUrl: './subject-group-details.html'
})
export class SubjectGroupDetails {
    constructor() { }
}
