import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditClassDialogComponent } from './add-edit-class-dialog.component';

describe('AddEditClassDialogComponent', () => {
  let component: AddEditClassDialogComponent;
  let fixture: ComponentFixture<AddEditClassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditClassDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditClassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
