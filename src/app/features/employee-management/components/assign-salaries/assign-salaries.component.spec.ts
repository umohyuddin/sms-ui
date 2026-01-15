import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSalariesComponent } from './assign-salaries.component';

describe('AssignSalariesComponent', () => {
  let component: AssignSalariesComponent;
  let fixture: ComponentFixture<AssignSalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignSalariesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignSalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
