import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstsalesreportComponent } from './gstsalesreport.component';

describe('GstsalesreportComponent', () => {
  let component: GstsalesreportComponent;
  let fixture: ComponentFixture<GstsalesreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstsalesreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstsalesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
