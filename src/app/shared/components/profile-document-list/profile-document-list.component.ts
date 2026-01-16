import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-document-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile-document-list.component.html',
  styleUrl: './profile-document-list.component.css',
    encapsulation: ViewEncapsulation.None 
})
export class ProfileDocumentListComponent {

    @Input() doc: any;
  @Input() getFileIcon!: (fileType: string) => string;
  @Output() download = new EventEmitter<any>();

  onDownload() {
    this.download.emit(this.doc);
  }
}
