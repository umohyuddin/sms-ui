import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSalaryDialogComponent } from './add-edit-salary-dialog.component';

describe('AddEditSalaryDialogComponent', () => {
  let component: AddEditSalaryDialogComponent;
  let fixture: ComponentFixture<AddEditSalaryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSalaryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSalaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
