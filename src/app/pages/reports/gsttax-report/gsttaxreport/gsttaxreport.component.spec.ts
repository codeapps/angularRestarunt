import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GsttaxreportComponent } from './gsttaxreport.component';

describe('GsttaxreportComponent', () => {
  let component: GsttaxreportComponent;
  let fixture: ComponentFixture<GsttaxreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GsttaxreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsttaxreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
