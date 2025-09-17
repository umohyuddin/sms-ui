import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMarksAndGradingDialogComponent } from './add-edit-marks-and-grading-dialog.component';

describe('AddEditMarksAndGradingDialogComponent', () => {
  let component: AddEditMarksAndGradingDialogComponent;
  let fixture: ComponentFixture<AddEditMarksAndGradingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditMarksAndGradingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMarksAndGradingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
