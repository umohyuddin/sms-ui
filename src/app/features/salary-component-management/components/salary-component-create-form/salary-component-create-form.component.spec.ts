import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryComponentCreateFormComponent } from './salary-component-create-form.component';

describe('SalaryComponentCreateFormComponent', () => {
  let component: SalaryComponentCreateFormComponent;
  let fixture: ComponentFixture<SalaryComponentCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryComponentCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryComponentCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
