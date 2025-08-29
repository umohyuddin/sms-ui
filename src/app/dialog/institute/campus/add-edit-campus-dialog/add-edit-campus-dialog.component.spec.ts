import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCampusDialogComponent } from './add-edit-campus-dialog.component';

describe('AddEditCampusDialogComponent', () => {
  let component: AddEditCampusDialogComponent;
  let fixture: ComponentFixture<AddEditCampusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCampusDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCampusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
