import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolProfileCreateComponent } from './school-profile-create.component';

describe('SchoolProfileCreateComponent', () => {
  let component: SchoolProfileCreateComponent;
  let fixture: ComponentFixture<SchoolProfileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolProfileCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
