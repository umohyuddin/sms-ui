import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesParticularsComponent } from './fees-particulars.component';

describe('FeesParticularsComponent', () => {
  let component: FeesParticularsComponent;
  let fixture: ComponentFixture<FeesParticularsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesParticularsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesParticularsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
