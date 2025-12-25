import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureInfoComponent } from './salary-structure-info.component';

describe('SalaryStructureInfoComponent', () => {
  let component: SalaryStructureInfoComponent;
  let fixture: ComponentFixture<SalaryStructureInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
