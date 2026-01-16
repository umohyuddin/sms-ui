import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProfileDocumentUploadComponent } from '../profile-document-upload/profile-document-upload.component';
import { ProfileDocumentGroupComponent } from '../profile-document-group/profile-document-group.component';

@Component({
  selector: 'app-profile-document-tab',
  standalone: true,
  imports: [ProfileDocumentUploadComponent,ProfileDocumentGroupComponent],
  templateUrl: './profile-document-tab.component.html',
  styleUrl: './profile-document-tab.component.css'
})
export class ProfileDocumentTabComponent {
@Input() activeTab!: string;
  @Input() docsForm!: FormGroup;
  @Input() docsTypeDD: any[] = [];
  @Input() documentsByType: any = {};

  onFileSelected(file: File) {
    console.log('Selected File:', file);
    // handle file
  }

  onDocsSubmit() {
    console.log('Form submitted');
  }

  onDocsCancel() {
    console.log('Form cancelled');
  }

  downloadFile(doc: any) {
    console.log('Download file', doc);
  }

  getFileIcon(fileType: string) {
    switch(fileType) {
      case 'pdf': return 'assets/icons/pdf-icon.png';
      case 'doc': return 'assets/icons/doc-icon.png';
      default: return 'assets/icons/file-icon.png';
    }
  }
}
