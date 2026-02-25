import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ExamWeightageCreateFormComponent } from '../../components/exam-weightage-create-form/exam-weightage-create-form.component';

@Component({
    selector: 'app-exam-weightage-create',
    imports: [MatExpansionModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ExamWeightageCreateFormComponent,
    ],
    templateUrl: './exam-weightage-create.html',
    styleUrls: ['./exam-weightage-create.css'],
    standalone: true,
})
export class ExamWeightageCreate {
    constructor() { }
}
