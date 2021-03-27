import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitorsasondateComponent } from './debitorsasondate.component';

describe('DebitorsasondateComponent', () => {
  let component: DebitorsasondateComponent;
  let fixture: ComponentFixture<DebitorsasondateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitorsasondateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitorsasondateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
