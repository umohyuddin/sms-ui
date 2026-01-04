import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-sub-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-sub-header.component.html',
  styleUrl: './page-sub-header.component.css'
})
export class PageSubHeaderComponent {
  @Input() title!: string;

  // Optional button
  @Input() buttonText?: string;
  @Input() showButton: boolean = true;
  @Input() buttonClass = 'btn btn-outline-success';
  @Input() buttonIcon: string = 'la la-plus';
  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}
