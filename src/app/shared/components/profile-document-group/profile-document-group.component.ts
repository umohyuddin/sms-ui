import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProfileDocumentListComponent } from '../profile-document-list/profile-document-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-document-group',
  standalone: true,
  imports: [CommonModule, ProfileDocumentListComponent],
  templateUrl: './profile-document-group.component.html',
  styleUrl: './profile-document-group.component.css'
})
export class ProfileDocumentGroupComponent {

    @Input() groupKey!: string;
  @Input() docs: any[] = [];
  @Input() getFileIcon!: (fileType: string) => string;

  @Output() download = new EventEmitter<any>();

  onDownload(doc: any) {
    this.download.emit(doc);
  }

  
}
