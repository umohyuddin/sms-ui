import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserRoleDialogComponent } from './add-edit-user-role-dialog.component';

describe('AddEditUserRoleDialogComponent', () => {
  let component: AddEditUserRoleDialogComponent;
  let fixture: ComponentFixture<AddEditUserRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditUserRoleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUserRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
