import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileDetailComponent } from './student-profile-detail.component';

describe('StudentProfileDetailComponent', () => {
  let component: StudentProfileDetailComponent;
  let fixture: ComponentFixture<StudentProfileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentProfileDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
