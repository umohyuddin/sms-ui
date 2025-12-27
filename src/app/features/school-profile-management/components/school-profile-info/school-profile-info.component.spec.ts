import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolProfileInfoComponent } from './school-profile-info.component';

describe('SchoolProfileInfoComponent', () => {
  let component: SchoolProfileInfoComponent;
  let fixture: ComponentFixture<SchoolProfileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolProfileInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
