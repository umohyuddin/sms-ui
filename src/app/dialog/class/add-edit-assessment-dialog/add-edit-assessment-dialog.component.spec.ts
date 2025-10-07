import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAssessmentDialogComponent } from './add-edit-assessment-dialog.component';

describe('AddEditAssessmentDialogComponent', () => {
  let component: AddEditAssessmentDialogComponent;
  let fixture: ComponentFixture<AddEditAssessmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAssessmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAssessmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
