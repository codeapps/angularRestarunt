import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingledgercompareComponent } from './outstandingledgercompare.component';

describe('OutstandingledgercompareComponent', () => {
  let component: OutstandingledgercompareComponent;
  let fixture: ComponentFixture<OutstandingledgercompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingledgercompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingledgercompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
