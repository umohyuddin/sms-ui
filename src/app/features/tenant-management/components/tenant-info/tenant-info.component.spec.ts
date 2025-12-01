import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { TenantInfoComponent } from './tenant-info.component';

describe('TenantInfoComponent', () => {
  let component: TenantInfoComponent;
  let fixture: ComponentFixture<TenantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantInfoComponent, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
