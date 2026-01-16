import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-document-upload',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile-document-upload.component.html',
  styleUrl: './profile-document-upload.component.css'
})
export class ProfileDocumentUploadComponent {

  @Input() docsForm!: FormGroup;
  @Input() docsTypeDD: any[] = [];

  @Output() fileSelected = new EventEmitter<File>();
  @Output() formSubmit = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  get docKey() {
    return this.docsForm.get('docKey');
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileSelected.emit(input.files[0]);
    }
  }

  onSubmit() {
    this.formSubmit.emit();
  }

  onCancel() {
    this.formCancel.emit();
  }
}

