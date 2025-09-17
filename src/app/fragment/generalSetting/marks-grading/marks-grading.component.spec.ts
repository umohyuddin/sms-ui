import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksGradingComponent } from './marks-grading.component';

describe('MarksGradingComponent', () => {
  let component: MarksGradingComponent;
  let fixture: ComponentFixture<MarksGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarksGradingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarksGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
