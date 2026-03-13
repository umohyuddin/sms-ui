import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChargeTypeCreateFormComponent } from '../../components/charge-type-create-form/charge-type-create-form.component';

@Component({
    selector: 'app-charge-type-create',
    standalone: true,
    imports: [CommonModule, ChargeTypeCreateFormComponent],
    templateUrl: './charge-type-create.html',
    styleUrls: ['./charge-type-create.css']
})
export class ChargeTypeCreate { }
