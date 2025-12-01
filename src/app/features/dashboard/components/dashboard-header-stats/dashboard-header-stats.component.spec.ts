import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHeaderStatsComponent } from './dashboard-header-stats.component';

describe('DashboardHeaderStatsComponent', () => {
  let component: DashboardHeaderStatsComponent;
  let fixture: ComponentFixture<DashboardHeaderStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHeaderStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardHeaderStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
