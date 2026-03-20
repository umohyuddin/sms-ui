import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentManagementService } from '../../services/student-management.service';
import { GuardianResponse } from '../../models/GuardianResponse';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-student-guardian-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './student-guardian-detail.component.html',
  styleUrls: ['./student-guardian-detail.component.css']
})
export class StudentGuardianDetailComponent  {
  @Input() studentId!: string;
  @Output() guardianUpdated = new EventEmitter<void>();

  guardians: GuardianResponse[] = [];
  selectedGuardian?: GuardianResponse;
  guardianForm!: FormGroup;
  relationDD: KeyValueOption[] = [];
  showGuardianForm = false;
  isEditMode = false;
  isLoading = false;
  loadingMessage = '';

  @ViewChild('toaster') private toaster?: ToasterComponent;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentManagementService
  ) {}

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes.studentId && changes.studentId.currentValue) {
//       this.loadGuardians();
//     }
//   }

  ngOnInit(): void {
    this.initializeForm();
    this.loadLookups();
    if (this.studentId) {
      this.loadGuardians();
    }
  }

  initializeForm(): void {
    this.guardianForm = this.fb.group({
      firstName: ['', [Validators.required, this.noWhitespaceValidator]],
      middleName: [''],
      lastName: ['', [Validators.required, this.noWhitespaceValidator]],
      fullName: [''],
      relationId: ['', Validators.required],
      cnic: ['', Validators.required],
      phone: ['', Validators.required],
      alternatePhone: [''],
      email: ['', [Validators.email]],
      address: [''],
      occupation: [''],
      organization: [''],
      isActive: [true]
    });
  }

  private loadLookups(): void {
    this.studentService.getActiveGuardianRelations().subscribe({
      next: (response) => {
        const relations = response?.body?.data ?? response?.body ?? response?.data ?? [];
        this.relationDD = Array.isArray(relations)
          ? relations.map((item: any) => ({ key: String(item.id ?? item.key ?? ''), label: item.name ?? item.label ?? item.description ?? String(item) }))
          : [];
      },
      error: (error) => {
        console.error('Failed to load guardian relations:', error);
      }
    });
  }

  loadGuardians(): void {
    if (!this.studentId) return;
    this.isLoading = true;
    this.loadingMessage = 'Loading guardians...';

    this.studentService.getGuardiansByStudentId(this.studentId).subscribe({
      next: (response) => {
        this.guardians = response.body ?? [];
      },
      error: (error) => {
        console.error('Failed to load guardians:', error);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }

  onAddGuardian(): void {
    this.isEditMode = false;
    this.selectedGuardian = undefined;
    this.showGuardianForm = true;
    this.guardianForm.reset({ isActive: true });
    this.guardianForm.enable();
  }

  onEditGuardian(guardian: GuardianResponse): void {
    this.isEditMode = true;
    this.selectedGuardian = guardian;
    this.showGuardianForm = true;
    this.guardianForm.patchValue({
      ...guardian,
      relationId: guardian.relationId ?? ''
    });
    this.guardianForm.enable();
  }

  toggleGuardianForm(): void {
    this.showGuardianForm = !this.showGuardianForm;
    if (!this.showGuardianForm) {
      this.selectedGuardian = undefined;
    }
  }

  onGuardianSubmit(): void {
    if (this.guardianForm.invalid) {
      this.guardianForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.guardianForm.getRawValue(),
      fullName: `${this.guardianForm.value.firstName} ${this.guardianForm.value.middleName || ''} ${this.guardianForm.value.lastName}`.trim().replace(/\s+/g, ' '),
      studentId: this.studentId
    };

    this.isLoading = true;
    this.loadingMessage = this.isEditMode ? 'Updating guardian...' : 'Saving guardian...';

    const request$ = this.isEditMode && this.selectedGuardian?.id
      ? this.studentService.updateGuardian(String(this.selectedGuardian.id), payload)
      : this.studentService.saveGuardian(payload);

    request$.subscribe({
      next: () => {
        this.toaster?.show(`Guardian ${this.isEditMode ? 'updated' : 'saved'} successfully.`, 'success');
        this.showGuardianForm = false;
        this.loadGuardians();
        this.guardianUpdated.emit();
      },
      error: (error) => {
        console.error('Error saving guardian:', error);
        this.toaster?.show('Failed to save guardian. Please try again.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }

  onDeleteGuardian(guardian: GuardianResponse): void {
    if (!guardian.id) return;
    
    if (confirm(`Are you sure you want to delete guardian "${guardian.fullName}"?`)) {
      this.isLoading = true;
      this.loadingMessage = 'Deleting guardian...';
      
      this.studentService.deleteGuardian(guardian.id).subscribe({
        next: () => {
          this.toaster?.show('Guardian deleted successfully.', 'success');
          this.loadGuardians();
          this.guardianUpdated.emit();
        },
        error: (error) => {
          console.error('Error deleting guardian:', error);
          this.toaster?.show('Failed to delete guardian.', 'error');
        },
        complete: () => {
          this.isLoading = false;
          this.loadingMessage = '';
        }
      });
    }
  }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.toString().trim()) {
      return { whitespace: true };
    }
    return null;
  }

  getRelationLabel(relationId: any): string {
    const found = this.relationDD.find((r) => r.key === String(relationId));
    return found?.label ?? String(relationId ?? '');
  }

  get firstName() { return this.guardianForm.get('firstName'); }
  get lastName() { return this.guardianForm.get('lastName'); }
  get relationId() { return this.guardianForm.get('relationId'); }
  get cnic() { return this.guardianForm.get('cnic'); }
  get phone() { return this.guardianForm.get('phone'); }
  get email() { return this.guardianForm.get('email'); }
}
