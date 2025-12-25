import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent {
@Input() label!: string;
  @Input() placeholder = '';
  @Input() control!: FormControl;
  @Input() type: string = 'text';
  @Input() colLabel = 'col-lg-1';
  @Input() colInput = 'col-lg-3';
  @Input() errorMessages: { [key: string]: string } = {};
}
