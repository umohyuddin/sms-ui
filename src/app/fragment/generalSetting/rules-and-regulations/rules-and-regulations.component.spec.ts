import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesAndRegulationsComponent } from './rules-and-regulations.component';

describe('RulesAndRegulationsComponent', () => {
  let component: RulesAndRegulationsComponent;
  let fixture: ComponentFixture<RulesAndRegulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesAndRegulationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RulesAndRegulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
