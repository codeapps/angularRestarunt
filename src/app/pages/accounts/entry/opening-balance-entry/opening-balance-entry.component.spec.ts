import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningBalanceEntryComponent } from './opening-balance-entry.component';

describe('OpeningBalanceEntryComponent', () => {
  let component: OpeningBalanceEntryComponent;
  let fixture: ComponentFixture<OpeningBalanceEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningBalanceEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningBalanceEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
