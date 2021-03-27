import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptVoucherComponent } from './receipt-voucher.component';

describe('ReceiptVoucherComponent', () => {
  let component: ReceiptVoucherComponent;
  let fixture: ComponentFixture<ReceiptVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
