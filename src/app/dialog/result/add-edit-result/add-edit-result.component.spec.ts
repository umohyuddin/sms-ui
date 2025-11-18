import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditResultComponent } from './add-edit-result.component';

describe('AddEditResultComponent', () => {
  let component: AddEditResultComponent;
  let fixture: ComponentFixture<AddEditResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
