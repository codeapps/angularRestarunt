import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionreportComponent } from './transactionreport.component';

describe('TransactionreportComponent', () => {
  let component: TransactionreportComponent;
  let fixture: ComponentFixture<TransactionreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
