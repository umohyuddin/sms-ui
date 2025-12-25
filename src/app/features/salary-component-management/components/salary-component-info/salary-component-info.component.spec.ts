import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryComponentInfoComponent } from './salary-component-info.component';

describe('SalaryComponentInfoComponent', () => {
  let component: SalaryComponentInfoComponent;
  let fixture: ComponentFixture<SalaryComponentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryComponentInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryComponentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
