import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAcademicDetailComponent } from './student-academic-detail.component';

describe('StudentAcademicDetailComponent', () => {
  let component: StudentAcademicDetailComponent;
  let fixture: ComponentFixture<StudentAcademicDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAcademicDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAcademicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
