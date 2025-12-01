import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginLeftSection } from './login-left-section';

describe('LoginLeftSection', () => {
  let component: LoginLeftSection;
  let fixture: ComponentFixture<LoginLeftSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginLeftSection, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginLeftSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
