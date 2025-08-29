import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploeeAttendanceComponent } from './employee-attendance.component';

describe('EmploeeAttendanceComponent', () => {
  let component: EmploeeAttendanceComponent;
  let fixture: ComponentFixture<EmploeeAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploeeAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploeeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
