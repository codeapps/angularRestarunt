import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanProductwiseComponent } from './salesman-productwise.component';

describe('SalesmanProductwiseComponent', () => {
  let component: SalesmanProductwiseComponent;
  let fixture: ComponentFixture<SalesmanProductwiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesmanProductwiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanProductwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
