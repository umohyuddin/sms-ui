import { RouterOutlet } from '@angular/router';
import { Component, signal } from '@angular/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    readonly title = signal('tenant-manager');
    // String alias for legacy tests that expect a plain string property
    readonly titleValue = 'tenant-manager';
}
