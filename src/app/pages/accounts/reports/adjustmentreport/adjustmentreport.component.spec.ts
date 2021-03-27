import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentreportComponent } from './adjustmentreport.component';

describe('AdjustmentreportComponent', () => {
  let component: AdjustmentreportComponent;
  let fixture: ComponentFixture<AdjustmentreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustmentreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
