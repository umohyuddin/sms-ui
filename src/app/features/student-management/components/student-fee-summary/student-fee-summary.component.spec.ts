import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeeSummaryComponent } from './student-fee-summary.component';

describe('StudentFeeSummaryComponent', () => {
  let component: StudentFeeSummaryComponent;
  let fixture: ComponentFixture<StudentFeeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFeeSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentFeeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
