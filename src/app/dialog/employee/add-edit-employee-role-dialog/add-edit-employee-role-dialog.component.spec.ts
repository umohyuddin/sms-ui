import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmployeeRoleDialogComponent } from './add-edit-employee-role-dialog.component';

describe('AddEditEmployeeRoleDialogComponent', () => {
  let component: AddEditEmployeeRoleDialogComponent;
  let fixture: ComponentFixture<AddEditEmployeeRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEmployeeRoleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEmployeeRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
