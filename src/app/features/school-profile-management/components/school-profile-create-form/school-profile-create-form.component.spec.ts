import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolProfileCreateFormComponent } from './school-profile-create-form.component';

describe('SchoolProfileCreateFormComponent', () => {
  let component: SchoolProfileCreateFormComponent;
  let fixture: ComponentFixture<SchoolProfileCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolProfileCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolProfileCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
