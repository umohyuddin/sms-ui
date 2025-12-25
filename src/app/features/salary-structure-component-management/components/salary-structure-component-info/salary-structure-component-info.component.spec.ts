import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureComponentInfoComponent } from './salary-structure-component-info.component';

describe('SalaryStructureComponentInfoComponent', () => {
  let component: SalaryStructureComponentInfoComponent;
  let fixture: ComponentFixture<SalaryStructureComponentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureComponentInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureComponentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
