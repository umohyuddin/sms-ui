import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSideWidgetTabComponent } from './profile-side-widget-tab.component';

describe('ProfileSideWidgetTabComponent', () => {
  let component: ProfileSideWidgetTabComponent;
  let fixture: ComponentFixture<ProfileSideWidgetTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSideWidgetTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSideWidgetTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
