import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { TenantDetails } from './tenant-details';

describe('TenantDetails', () => {
  let component: TenantDetails;
  let fixture: ComponentFixture<TenantDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantDetails, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
