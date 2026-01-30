import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css'
})
export class ToasterComponent {

    message = '';
  type: 'success' | 'error' | 'info' | 'warning' = 'info';
  visible = false;

  show(msg: string, type: any = 'info', duration = 3000) {
    this.message = msg;
    this.type = type;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, duration);
  }
}
