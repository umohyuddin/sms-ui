import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginRightSection } from './login-right-section';

describe('LoginRightSection', () => {
  let component: LoginRightSection;
  let fixture: ComponentFixture<LoginRightSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRightSection, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRightSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
