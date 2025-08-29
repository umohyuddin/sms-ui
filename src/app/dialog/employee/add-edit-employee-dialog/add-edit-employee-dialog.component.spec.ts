import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmployeeDialogComponent } from './add-edit-employee-dialog.component';

describe('AddEditEmployeeDialogComponent', () => {
  let component: AddEditEmployeeDialogComponent;
  let fixture: ComponentFixture<AddEditEmployeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEmployeeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
