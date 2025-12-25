import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureComponentCreateComponent } from './salary-structure-component-create.component';

describe('SalaryStructureComponentCreateComponent', () => {
  let component: SalaryStructureComponentCreateComponent;
  let fixture: ComponentFixture<SalaryStructureComponentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureComponentCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureComponentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
