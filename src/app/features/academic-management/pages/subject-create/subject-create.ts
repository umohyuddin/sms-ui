import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicManagementService } from '../../services/academic-management.service';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { SubjectGroup } from '../../models/academic.models';

@Component({
  selector: 'app-subject-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subject-create.html'
})
export class SubjectCreate implements OnInit {
  subjectForm: FormGroup;
  isEdit = false;
  subjectId: string | null = null;
  loading = false;
  groups: SubjectGroup[] = [];
  texts = PageTexts.academic.subjects;

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      subjectGroupId: ['', Validators.required],
      description: [''],
      isElective: [false],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadGroups();
    this.subjectId = this.route.snapshot.paramMap.get('id');
    if (this.subjectId) {
      this.isEdit = true;
      this.loadSubject();
    }
  }

  loadGroups() {
    this.academicService.getSubjectGroups().subscribe({
      next: (resp) => this.groups = resp.body || [],
      error: (err) => console.error(err)
    });
  }

  loadSubject() {
    this.academicService.getSubjectById(this.subjectId!).subscribe({
      next: (resp) => this.subjectForm.patchValue(resp.body),
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.subjectForm.invalid) return;
    this.loading = true;
    this.academicService.saveSubject(this.subjectId, this.subjectForm.value).subscribe({
      next: () => this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.LIST),
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCancel() {
    this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.LIST);
  }
}
