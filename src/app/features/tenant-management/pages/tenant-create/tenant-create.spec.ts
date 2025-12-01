import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { TenantCreate } from './tenant-create';

describe('TenantCreate', () => {
  let component: TenantCreate;
  let fixture: ComponentFixture<TenantCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantCreate, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
