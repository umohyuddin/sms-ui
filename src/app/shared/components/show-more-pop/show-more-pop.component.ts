import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-more-pop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-more-pop.component.html',
  styleUrl: './show-more-pop.component.css'
})
export class ShowMorePopComponent {
    @Input() title: string = 'Details'; 
@Input() items: any[] = []; // List of items to show
  @Input() displayFn: (item: any) => string = (item) => item; // How to display each item
  @Input() sliceCount: number = 2; // How many items to show inline

  showModal = false;

  open() {
    this.showModal = true;
  }

  close() {
    this.showModal = false;
  }
}
