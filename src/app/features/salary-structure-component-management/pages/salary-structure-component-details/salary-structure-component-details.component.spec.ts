import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureComponentDetailsComponent } from './salary-structure-component-details.component';

describe('SalaryStructureComponentDetailsComponent', () => {
  let component: SalaryStructureComponentDetailsComponent;
  let fixture: ComponentFixture<SalaryStructureComponentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureComponentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureComponentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
