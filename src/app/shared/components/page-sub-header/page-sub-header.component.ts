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

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}
