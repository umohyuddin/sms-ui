import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSubjectDialogComponent } from './add-edit-subject-dialog.component';

describe('AddEditSubjectDialogComponent', () => {
  let component: AddEditSubjectDialogComponent;
  let fixture: ComponentFixture<AddEditSubjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSubjectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSubjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
