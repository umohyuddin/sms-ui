import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeChallanDetailsComponent } from './fee-challan-details.component';

describe('FeeChallanDetailsComponent', () => {
  let component: FeeChallanDetailsComponent;
  let fixture: ComponentFixture<FeeChallanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeChallanDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeChallanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
