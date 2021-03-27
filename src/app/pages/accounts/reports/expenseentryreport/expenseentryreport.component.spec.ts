import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseentryreportComponent } from './expenseentryreport.component';

describe('ExpenseentryreportComponent', () => {
  let component: ExpenseentryreportComponent;
  let fixture: ComponentFixture<ExpenseentryreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseentryreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseentryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
