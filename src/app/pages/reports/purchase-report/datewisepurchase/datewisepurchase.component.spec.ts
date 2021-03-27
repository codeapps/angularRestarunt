import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatewisepurchaseComponent } from './datewisepurchase.component';

describe('DatewisepurchaseComponent', () => {
  let component: DatewisepurchaseComponent;
  let fixture: ComponentFixture<DatewisepurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatewisepurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatewisepurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
