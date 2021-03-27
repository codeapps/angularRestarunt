import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchertypeReportComponent } from './vouchertype-report.component';

describe('VouchertypeReportComponent', () => {
  let component: VouchertypeReportComponent;
  let fixture: ComponentFixture<VouchertypeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchertypeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchertypeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
