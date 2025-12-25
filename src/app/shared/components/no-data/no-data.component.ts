import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.css'
})
export class NoDataComponent {

  @Input() message: string = 'No data available at the moment.';
}
