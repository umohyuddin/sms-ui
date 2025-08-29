import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInstituteDialogComponent } from './add-edit-institute-dialog.component';

describe('AddEditInstituteDialogComponent', () => {
  let component: AddEditInstituteDialogComponent;
  let fixture: ComponentFixture<AddEditInstituteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditInstituteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditInstituteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
