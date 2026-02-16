import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeScaleCreateFormComponent } from '../../components/grade-scale-create-form/grade-scale-create-form.component';

@Component({
    selector: 'app-grade-scale-create',
    standalone: true,
    imports: [CommonModule, GradeScaleCreateFormComponent],
    templateUrl: './grade-scale-create.html'
})
export class GradeScaleCreate {
    constructor() { }
}
