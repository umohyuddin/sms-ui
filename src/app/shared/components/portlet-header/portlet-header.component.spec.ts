import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortletHeaderComponent } from './portlet-header.component';

describe('PortletHeaderComponent', () => {
  let component: PortletHeaderComponent;
  let fixture: ComponentFixture<PortletHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortletHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortletHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
