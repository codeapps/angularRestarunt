import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomermonthwisesalessummaryComponent } from './customermonthwisesalessummary.component';

describe('CustomermonthwisesalessummaryComponent', () => {
  let component: CustomermonthwisesalessummaryComponent;
  let fixture: ComponentFixture<CustomermonthwisesalessummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomermonthwisesalessummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomermonthwisesalessummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
