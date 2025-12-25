import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationDetailsComponent } from './designation-details.component';

describe('DesignationDetailsComponent', () => {
  let component: DesignationDetailsComponent;
  let fixture: ComponentFixture<DesignationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
