import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMcqComponent } from './add-edit-mcq.component';

describe('AddEditMcqComponent', () => {
  let component: AddEditMcqComponent;
  let fixture: ComponentFixture<AddEditMcqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditMcqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMcqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
