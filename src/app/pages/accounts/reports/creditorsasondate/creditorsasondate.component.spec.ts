import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditorsasondateComponent } from './creditorsasondate.component';

describe('CreditorsasondateComponent', () => {
  let component: CreditorsasondateComponent;
  let fixture: ComponentFixture<CreditorsasondateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditorsasondateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditorsasondateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
