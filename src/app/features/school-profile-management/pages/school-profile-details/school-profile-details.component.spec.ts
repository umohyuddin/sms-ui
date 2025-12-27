import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolProfileDetailsComponent } from './school-profile-details.component';

describe('SchoolProfileDetailsComponent', () => {
  let component: SchoolProfileDetailsComponent;
  let fixture: ComponentFixture<SchoolProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolProfileDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
