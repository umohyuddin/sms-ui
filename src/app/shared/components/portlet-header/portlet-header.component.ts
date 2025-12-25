import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-portlet-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portlet-header.component.html',
  styleUrl: './portlet-header.component.css'
})
export class PortletHeaderComponent {
  @Input() iconClass: string = 'flaticon-squares';
  @Input() title: string = 'Portlet Title';
  @Input() showActions: boolean = true;

  @Output() addButtonClick = new EventEmitter<void>();

  onAddClick() {
    this.addButtonClick.emit();
  }
}
