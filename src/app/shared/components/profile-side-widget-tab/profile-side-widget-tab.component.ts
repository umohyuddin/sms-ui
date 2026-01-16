import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-side-widget-tab',
  standalone: true,
  imports: [],
  templateUrl: './profile-side-widget-tab.component.html',
  styleUrl: './profile-side-widget-tab.component.css'
})
export class ProfileSideWidgetTabComponent {

   @Input() label: string = '';
  @Input() iconSvg: string = ''; // pass SVG as string
  @Input() tabKey: string = '';
  @Input() activeTab: string = '';
  @Output() tabSelected = new EventEmitter<string>();

  onClick() {
    this.tabSelected.emit(this.tabKey);
  }

   safeSvg: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    if (this.iconSvg) {
      this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.iconSvg);
    }
  }

}
