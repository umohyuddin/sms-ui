import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsForFeesInvoicesComponent } from './accounts-for-fees-invoices.component';

describe('AccountsForFeesInvoicesComponent', () => {
  let component: AccountsForFeesInvoicesComponent;
  let fixture: ComponentFixture<AccountsForFeesInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsForFeesInvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsForFeesInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
